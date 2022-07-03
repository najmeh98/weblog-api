import { Request, Response } from "express";
import { prisma } from "../utilis/prisma";
import jwt from "jsonwebtoken";
export const userValid = async (req: Request, res: Response) => {
  try {
    let Usertoken: any;

    //@ts-ignore
    console.log(req.userId);

    const userInfo = await prisma.user.findFirst({
      where: {
        //@ts-ignore
        id: req.userId,
      },
      include: {
        post: true,
      },
    });
    if (userInfo) {
      Usertoken = {
        id: userInfo?.id,
        isAdmin: userInfo?.isAdmin,
      };

      if (process.env.JWT_TOKEN) {
        const token = jwt.sign(Usertoken, process.env.JWT_TOKEN);

        const user = {
          id: userInfo?.id,
          fullName: userInfo?.name,
          email: userInfo?.email,
          bio: userInfo?.bio,
          skill: userInfo?.skill,
          isAdmin: userInfo?.isAdmin,
          createdAt: userInfo?.createdAt,
          token: token,
        };

        const post = userInfo?.post;

        res.status(200).json({ user, post });
      } else {
        res.status(400).json("No user");
      }
    }
  } catch (error) {
    res.status(500).json({ Error });
  }
};