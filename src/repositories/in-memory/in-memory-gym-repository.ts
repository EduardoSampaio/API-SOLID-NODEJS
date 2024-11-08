import { Gym, Prisma } from '@prisma/client';
import { GymsRepository } from '../intefaces/gym-repository';
import { randomUUID } from 'crypto';

export class InMemoryGymsRepository implements GymsRepository {

    public gyms: Gym[] = [];

    async findbyId(id: string): Promise<Gym | null> {
        const gym = this.gyms.find(gym => gym.id === id);

        if (!gym) {
            return null;
        }
        return gym;
    }

    async create(data: Prisma.GymCreateInput) {
        const gym = {
            id: randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
        }

        this.gyms.push(gym);

        return gym;
    }
}