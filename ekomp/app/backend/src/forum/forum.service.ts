import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type {
  AnnouncementDto,
  MediaDto,
  SessionDto,
  SpeakerDto,
  SponsorDto,
  UpdateParticipantDto,
} from './forum.dto.js';
import {
  ForumAnnouncement,
  ForumMedia,
  ForumParticipant,
  ForumSession,
  ForumSpeaker,
  ForumSponsor,
  ForumToken,
} from './forum.entities.js';

const ORDER = { sortOrder: 'ASC' } as const;

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(ForumParticipant)
    private readonly participants: Repository<ForumParticipant>,
    @InjectRepository(ForumSession)
    private readonly sessions: Repository<ForumSession>,
    @InjectRepository(ForumSpeaker)
    private readonly speakers: Repository<ForumSpeaker>,
    @InjectRepository(ForumMedia)
    private readonly media: Repository<ForumMedia>,
    @InjectRepository(ForumAnnouncement)
    private readonly announcements: Repository<ForumAnnouncement>,
    @InjectRepository(ForumSponsor)
    private readonly sponsors: Repository<ForumSponsor>,
    @InjectRepository(ForumToken)
    private readonly tokens: Repository<ForumToken>,
  ) {}

  // --- Herkese açık ---

  /** Yalnızca "yayında" oturumlar; konuşmacıların yalnızca yayındaki kayıtları. */
  async publicProgram(): Promise<ForumSession[]> {
    const rows = await this.sessions.find({
      where: { status: 'PUBLISHED' },
      order: { day: 'ASC', startTime: 'ASC', sortOrder: 'ASC' },
    });
    for (const s of rows) s.speakers = s.speakers.filter((sp) => sp.published);
    return rows;
  }

  publicSpeakers(): Promise<ForumSpeaker[]> {
    return this.speakers.find({ where: { published: true }, order: ORDER });
  }

  publicMedia(): Promise<ForumMedia[]> {
    return this.media.find({ where: { published: true }, order: ORDER });
  }

  publicAnnouncements(): Promise<ForumAnnouncement[]> {
    return this.announcements.find({
      where: { published: true },
      order: { publishedAt: 'DESC' },
    });
  }

  publicSponsors(): Promise<ForumSponsor[]> {
    return this.sponsors.find({ where: { published: true }, order: ORDER });
  }

  /** Herkese açık kurum listesi: yalnızca onaylı ve "herkese açık" seçenler; kişi adı yok. */
  async publicOrganizations() {
    const rows = await this.participants.find({
      where: { status: 'APPROVED', visibility: 'PUBLIC' },
    });
    const seen = new Set<string>();
    return rows
      .filter((p) => {
        const key = `${p.organization.toLowerCase()}|${p.country.toLowerCase()}`;
        return seen.has(key) ? false : (seen.add(key), true);
      })
      .map((p) => ({
        organization: p.organization,
        country: p.country,
        category: p.category,
      }));
  }

  /** Onaylı katılımcılar için dizin. İletişim bilgisi yalnızca sahibi izin verdiyse görünür. */
  async directory(requesterId: string) {
    const me = await this.participants.findOneBy({ id: requesterId });
    if (!me || me.status !== 'APPROVED') return null;
    const rows = await this.participants.find({
      where: { status: 'APPROVED' },
    });
    return rows
      .filter((p) => p.visibility !== 'HIDDEN' || p.id === requesterId)
      .map((p) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        organization: p.organization,
        jobTitle: p.jobTitle,
        country: p.country,
        city: p.city,
        category: p.category,
        bio: p.bio,
        interests: p.interests,
        photoUrl: p.photoUrl,
        wantsB2B: p.wantsB2B,
        email: p.shareContact ? p.email : null,
        phone: p.shareContact ? p.phone : null,
      }));
  }

  // --- Yönetim: katılımcılar ---

  listParticipants(): Promise<ForumParticipant[]> {
    return this.participants.find({ order: { createdAt: 'DESC' } });
  }

  async updateParticipant(
    id: string,
    dto: UpdateParticipantDto,
  ): Promise<ForumParticipant> {
    const row = await this.participants.findOneBy({ id });
    if (!row) throw new NotFoundException('Katılımcı bulunamadı.');
    if (dto.status !== undefined) row.status = dto.status;
    if (dto.adminNote !== undefined) row.adminNote = dto.adminNote;
    if (dto.verifyEmail && !row.emailVerifiedAt)
      row.emailVerifiedAt = new Date();
    return this.participants.save(row);
  }

  /** KVKK silme talebi: başvuru sahibi ve ona ait tüm doğrulama/sıfırlama jetonları kalıcı olarak silinir. */
  async removeParticipant(id: string): Promise<void> {
    const row = await this.participants.findOneBy({ id });
    if (!row) throw new NotFoundException('Katılımcı bulunamadı.');
    await this.tokens.delete({ participantId: id });
    await this.participants.delete(id);
  }

  async stats() {
    const all = await this.participants.find();
    const approved = all.filter((p) => p.status === 'APPROVED');
    const count = (cat: string) =>
      approved.filter((p) => p.category === cat).length;
    return {
      participants: {
        total: all.length,
        approved: approved.length,
        pending: all.filter(
          (p) => p.status === 'RECEIVED' || p.status === 'REVIEW',
        ).length,
        countries: new Set(approved.map((p) => p.country.trim().toLowerCase()))
          .size,
        tourOperators: count('TOUR_OPERATOR'),
        federations: count('SPORTS_FEDERATION'),
      },
      speakers: await this.speakers.count(),
      sessions: await this.sessions.count(),
      missingTranslations: await this.missingTranslations(),
    };
  }

  /** TR dolu ama EN boş kayıtlar — yönetici panelinde eksik çeviri uyarısı için. */
  private async missingTranslations(): Promise<number> {
    const [s, sp, a, m] = await Promise.all([
      this.sessions.find(),
      this.speakers.find(),
      this.announcements.find(),
      this.media.find(),
    ]);
    return (
      s.filter((x) => !x.titleEn.trim()).length +
      sp.filter((x) => x.bioTr.trim() && !x.bioEn.trim()).length +
      a.filter((x) => !x.titleEn.trim()).length +
      m.filter((x) => x.titleTr.trim() && !x.titleEn.trim()).length
    );
  }

  // --- Yönetim: içerik CRUD ---

  listSessions(): Promise<ForumSession[]> {
    return this.sessions.find({
      order: { day: 'ASC', startTime: 'ASC', sortOrder: 'ASC' },
    });
  }

  async saveSession(
    dto: Partial<SessionDto>,
    id?: string,
  ): Promise<ForumSession> {
    const { speakerIds, ...fields } = dto;
    const row = id
      ? await this.sessions.findOneBy({ id })
      : this.sessions.create();
    if (!row) throw new NotFoundException('Oturum bulunamadı.');
    Object.assign(row, fields);
    if (speakerIds)
      row.speakers = speakerIds.length
        ? await this.speakers.findBy({ id: In(speakerIds) })
        : [];
    return this.sessions.save(row);
  }

  listSpeakers(): Promise<ForumSpeaker[]> {
    return this.speakers.find({ order: ORDER });
  }
  listMedia(): Promise<ForumMedia[]> {
    return this.media.find({ order: ORDER });
  }
  listAnnouncements(): Promise<ForumAnnouncement[]> {
    return this.announcements.find({ order: { publishedAt: 'DESC' } });
  }
  listSponsors(): Promise<ForumSponsor[]> {
    return this.sponsors.find({ order: ORDER });
  }

  saveSpeaker(dto: Partial<SpeakerDto>, id?: string) {
    return this.save(this.speakers, dto, id, 'Konuşmacı');
  }
  saveMedia(dto: Partial<MediaDto>, id?: string) {
    return this.save(this.media, dto, id, 'Medya');
  }
  saveAnnouncement(dto: Partial<AnnouncementDto>, id?: string) {
    return this.save(this.announcements, dto, id, 'Duyuru');
  }
  saveSponsor(dto: Partial<SponsorDto>, id?: string) {
    return this.save(this.sponsors, dto, id, 'Destekçi');
  }

  async remove(
    kind: 'sessions' | 'speakers' | 'media' | 'announcements' | 'sponsors',
    id: string,
  ) {
    const repo = this[kind] as Repository<{ id: string }>;
    const result = await repo.delete(id);
    if (!result.affected) throw new NotFoundException('Kayıt bulunamadı.');
  }

  private async save<T extends { id: string }>(
    repo: Repository<T>,
    dto: object,
    id: string | undefined,
    label: string,
  ): Promise<T> {
    const row = id ? await repo.findOneBy({ id } as never) : repo.create();
    if (!row) throw new NotFoundException(`${label} bulunamadı.`);
    return repo.save(Object.assign(row, dto));
  }
}
