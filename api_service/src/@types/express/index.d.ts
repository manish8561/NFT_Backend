import express from "express";
import mongoose from "mongoose";

type REQUEST_USER = {
    _id: mongoose.Types.ObjectId;
    walletAddress: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: REQUEST_USER | Record<string, any>
    }
  }
}