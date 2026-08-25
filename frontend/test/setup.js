import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

process.env.VITE_AUTH_API_URL = "http://localhost:5000/api/auth";

if (!global.fetch) {
  global.fetch = jest.fn();
}