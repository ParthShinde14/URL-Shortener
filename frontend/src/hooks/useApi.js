import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const shortenUrl = (longUrl, expiresIn) =>
  api.post("/shorten", { longUrl, expiresIn }).then((r) => r.data);

export const getLinks = () =>
  api.get("/links").then((r) => r.data);

export const deleteLink = (code) =>
  api.delete(`/links/${code}`).then((r) => r.data);

export const getStats = (code) =>
  api.get(`/stats/${code}`).then((r) => r.data);
