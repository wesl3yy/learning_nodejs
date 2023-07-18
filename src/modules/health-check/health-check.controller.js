import os from "os";
import { Router } from "express";
import { MB, GB } from "../../const/unit";

export function HealthCheckController() {
  const router = Router();
  const none = 'none';
  const numConfig = 100;

  router.get('/', async (req, res) => {
    try {
      const { freemem, totalmem, cpus } = os;
      // TODO: get free memmory and total memmory
      const freeMem = Math.floor(freemem() / MB) / (numConfig * 10);
      const totalMem = Math.floor(totalmem() / GB);
      const usedMemPercent = (totalmem() - freemem()) / totalmem();
      const used = (usedMemPercent * numConfig).toFixed(2);

      // TODO: get idle cpu cores
      const { user, system } = process.cpuUsage();
      const cpuUsed = Math.floor((system / user) * numConfig);
      const { model, speed } = cpus()[0];
      const healcheck = {
        cpus: {
          model: model || none,
          speed: `${speed}MHz` || none,
          cores: `${cpus().length} cores`,
          used: `${cpuUsed}%`,
        },
        mem: {
          swap: `${(totalMem - freeMem).toFixed(2)}GB/${totalMem}GB`,
          used: `${used}%`,
        },
        message: 'OK',
        timestamp: new Date().toISOString()
      };
      res.json(healcheck)
    } catch (e) {
      res.json({ message: e })
    }
  })

  return router;
}