import type { Request, Response } from "express";
import type { UserService } from "../services/user.service";
import { parseDirectoryQuery } from "../http/query.parser";

export class UserController {
  constructor(private readonly userService: UserService) {}

  getDirectory = (req: Request, res: Response): void => {
    const query = parseDirectoryQuery(req.query as Record<string, unknown>);
    const result = this.userService.getDirectory(query);
    res.json(result);
  };
}
