const useConfig = "server";
let config;

if (useConfig === "dev") {
  config = "http://localhost:9090/";
}

if (useConfig === "server") {
  config = "https://nagbackend.azurewebsites.net";
}

export default config;
