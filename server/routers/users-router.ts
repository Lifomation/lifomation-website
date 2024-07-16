import { Router } from "express";
import { Request, Response } from "express";
import { User } from "../models/user";
import { dataSource } from "../db/database";


export const UsersRouter = Router();

const userRepo = dataSource.getRepository(User);

UsersRouter.post('/', async (req: Request, res: Response) => {
    try {
      const newUser: User = {
        id : req.body.userId,
        documents : []
      }
      console.log(newUser);
      const results = await userRepo.save(newUser);
      res.status(201).json(results);
    } catch (err : any) {
      res.status(500).json({ message: err.message });
    }
  });

UsersRouter.get('/', async (req: Request, res: Response) => {
    try {
      const allUsers = await userRepo.find();
      res.status(200).json(allUsers);
    } catch (err : any) {
      res.status(500).json({ message: err.message });
    }
  });


