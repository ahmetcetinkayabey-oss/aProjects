import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './reservation.entity.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreateReservationDto): Promise<Reservation> {
    const reservation = this.reservationsRepository.create(dto);
    const saved = await this.reservationsRepository.save(reservation);
    // Beklemeden gönderilir; başarısız olsa bile talep kaydedilmiştir.
    void this.notifications.notify({
      subject: `Yeni kamp talebi: ${saved.organizationName}`,
      text: [
        `Kurum: ${saved.organizationName}`,
        `İletişim: ${saved.contactName}`,
        `E-posta: ${saved.email}`,
        `Telefon: ${saved.phone}`,
        `Branş: ${saved.sportBranch}`,
        `Kafile: ${saved.groupSize ?? '-'}`,
        `Tarih: ${saved.preferredStartDate ?? '-'} / ${saved.preferredEndDate ?? '-'}`,
        `Not: ${saved.message ?? '-'}`,
        '',
        'Talebi yönetim panelinden görüntüleyebilirsiniz.',
      ].join('\n'),
    });
    // Talep sahibine otomatik onay e-postası (SMTP tanımlı değilse sessizce atlanır).
    void this.notifications.sendMail({
      to: saved.email,
      subject: "Kamp talebiniz alındı / Your camp request has been received",
      text: [
        `Merhaba ${saved.contactName},`,
        "",
        "Erzurum Yüksek İrtifa Kamp Merkezi kamp talebiniz bize ulaştı. Ekibimiz en kısa sürede sizinle iletişime geçecek.",
        "",
        "----------",
        "",
        `Hello ${saved.contactName},`,
        "",
        "We have received your camp request for the Erzurum High Altitude Camp Centre. Our team will contact you shortly.",
        "",
        "Bu talebi siz yapmadıysanız bu e-postayı yok sayabilirsiniz. / If you did not make this request, you can ignore this email.",
      ].join('\n'),
    });
    return saved;
  }

  findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async update(
    id: string,
    changes: { status?: ReservationStatus; adminNote?: string | null },
  ): Promise<Reservation> {
    const item = await this.reservationsRepository.findOneBy({ id });
    if (!item) throw new NotFoundException('Talep bulunamadı.');
    return this.reservationsRepository.save(Object.assign(item, changes));
  }

  async remove(id: string): Promise<void> {
    const result = await this.reservationsRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Talep bulunamadı.');
  }

  async countByStatus(): Promise<Record<string, number>> {
    const rows = await this.reservationsRepository
      .createQueryBuilder('r')
      .select('r.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('r.status')
      .getRawMany<{ status: string; count: string }>();
    return Object.fromEntries(rows.map((r) => [r.status, Number(r.count)]));
  }
}
