import { InteractionResponseType } from "discord-interactions";
import { Response } from "express";

export interface InteractionsResponse {
  type: InteractionResponseType;
  data?: {
    type: InteractionResponseType;
    content: string | undefined;
  };
}

export type InteractionsApiResponse = Response<InteractionsResponse>;

export type Command = {
  name: string;
  description: string;
};
