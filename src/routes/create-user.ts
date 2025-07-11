import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { hashedPassword } from "../utils/hash";


export function createUser(app: FastifyInstance) {

    const createUserSchema = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().min(8),
    })

    app.post("/user", async (req, res) => {
        const { name, email, password } = createUserSchema.parse(req.body);
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            }
        })
        if (existingUser) {
            return res.status(400).send({
                message: "User already exists",
            })
        }

        const hashPassword = await hashedPassword(password)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
            }
        })
        return res.status(201).send(user);

    })

}