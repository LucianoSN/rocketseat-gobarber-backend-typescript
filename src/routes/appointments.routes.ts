import { Router } from 'express';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '../services/CreateAppointmentService';
import AllAppointmentService from '../services/AllAppointmentService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
    const allAppointment = new AllAppointmentService();
    const appointments = await allAppointment.execute();

    return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
    try {
        const { provider_id, date } = request.body;

        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentService();

        const appointment = await createAppointment.execute({
            provider_id,
            date: parsedDate,
        });

        return response.json(appointment);
    } catch (e) {
        return response.status(400).json({ error: e.message });
    }
});

export default appointmentsRouter;
