const useConfig = "dev";
let config;

if (useConfig === "dev") {
  config = "http://localhost:9090/";
}

if (useConfig === "server") {
  config = "https://azurenagtechbackend.azurewebsites.net";
}

if (useConfig === "ngrok") {
  config =
    "https://ccd4-2409-40f4-1031-f756-75d1-4b1f-d023-8c03.ngrok-free.app";
}

export default config;
