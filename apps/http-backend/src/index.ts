import Express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CReateRoomSchema,
  CreateUserSchema,
  SignSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { middleware } from "./middleware";
const app = Express();
app.use(Express.json());

app.post("/signup", async (req, res) => {
  const parseData = CreateUserSchema.safeParse(req.body);
  if (!parseData.success) {
    console.log(parseData.error);
    res.json({
      message: "incorrect inputs",
    });
    return;
  }

  //    db call
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parseData.data?.username,
        password: parseData.data.password,
        name: parseData.data.name,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "user already exists",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parseData = SignSchema.safeParse(req.body);
  if (!parseData.success) {
    res.json({
      message: "incorrect  inputs",
    });
    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parseData.data.username,
      password: parseData.data.password,
    },
  });

  if (!user) {
    res.status(411).json({
      message: "Not a valid user",
    });
  }
  const token = jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET
  );
  res.json({
    token,
  });
});
app.post("/room", middleware, async (req, res) => {
  // db-call
  const parseData = CReateRoomSchema.safeParse(req.body);
  if (!parseData.success) {
    res.json({
      message: "incorrect inputs",
    });
    return;
  }
  // @ts-ignore
  const userId = req.userId;
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parseData.data.name,
        adminId: userId,
      },
    });
    res.json({
      roomId: room.id,
    });
  } catch (e) {
    console.log(e)
    res.status(411).json({
      message: "room is alredy exist",
    });
    
  }
});

app.listen(3001);
