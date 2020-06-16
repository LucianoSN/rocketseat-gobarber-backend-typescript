import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

class AllAppointmentService {
    public async execute(): Promise<Appointment[]> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository
        );
        return appointmentsRepository.find();
    }
}

export default AllAppointmentService;
