import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from "zod";
import { compare } from "bcryptjs";
import { verifyPassword } from "../utils/hash";
import { sign } from "crypto";

export function login(app: FastifyInstance){

    const loginSchema = z.object({
        email: z.email(),
        password: z.string(),
    })

    app.post("/login", async (req, res) => {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        })

        if (!user){
            return res.status(404).send({ message: "User not found"})
        }
        const isPassword  = await verifyPassword(password, user.password)

        if (!isPassword){
            return res.status(401).send({ message: "Invalid password"})
        }
        const token = await app.jwt.sign({id: user.id, email: user.email})

        return res.status(200).send({message: "Login successful", token})
    })
}