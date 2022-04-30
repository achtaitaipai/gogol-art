var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// src/index.ts
var import_express3 = __toESM(require("express"));
var import_config = require("dotenv/config");
var import_path = __toESM(require("path"));
var import_cors = __toESM(require("cors"));

// src/controllers/infos.controller.ts
var import_express = require("express");

// src/services/infoBox.service.ts
var import_axios = __toESM(require("axios"));
var import_duckduckgo_images_api = require("duckduckgo-images-api");
var SlideDatas = class {
  constructor() {
  }
  async getImgWiki(id) {
    try {
      const wikiDatas = await import_axios.default.get(`https://fr.wikipedia.org/w/api.php?action=query&prop=pageimages|pageterms&piprop=thumbnail&pithumbsize=1000&&format=json&pageids=${id}`);
      return wikiDatas.data.query.pages[id].thumbnail;
    } catch (error) {
      return { msg: "pb d'image", error };
    }
  }
  async getImgs(toSearch) {
    try {
      const imgs = await (0, import_duckduckgo_images_api.image_search)({ query: toSearch });
      return imgs.map((img) => {
        const { title, image, width, height, thumbnail } = img;
        return { title, source: thumbnail, width, height };
      });
    } catch (error) {
    }
  }
  async getInfoBox(id) {
    var _a, _b, _c, _d;
    try {
      const wikiDatas = await import_axios.default.get(`https://fr.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&pageids=${id}&rvsection=0`);
      let infos = (_d = (_c = (_b = (_a = wikiDatas == null ? void 0 : wikiDatas.data) == null ? void 0 : _a.query) == null ? void 0 : _b.pages[id]) == null ? void 0 : _c.revisions[0]["*"]) == null ? void 0 : _d.match(/\{Infobox((.|\s)*?)\}/)[0];
      if (!infos)
        return { msg: "pas de box" };
      infos = infos.replace(/\s+/gm, " ");
      infos = infos.replace(/\[|\]/g, "");
      const datas = infos.split("|").map((l) => l.split("="));
      const hauteur = this.parseInfosBox("hauteur", datas);
      const largeur = this.parseInfosBox("largeur", datas);
      const technique = this.parseInfosBox("technique", datas);
      const unity = this.parseInfosBox("unit\xE9", datas);
      let retour = {
        titre: this.parseInfosBox("titre", datas),
        artiste: this.parseInfosBox("artiste", datas),
        dimensions: (largeur !== "" && hauteur != "" ? largeur + " x " + hauteur + " " + unity : "").trim(),
        date: this.parseInfosBox("ann\xE9e", datas),
        medium: technique !== "" ? technique : this.parseInfosBox("type", datas),
        localisation: (this.parseInfosBox("mus\xE9e", datas) + " " + this.parseInfosBox("ville", datas) + " " + this.parseInfosBox("france", datas)).trim()
      };
      return { msg: "ok", body: retour };
    } catch (error) {
      return { msg: "pb d'infobox", error };
    }
  }
  parseInfosBox(name, box) {
    const reg = new RegExp(name, "i");
    const line = box.find((l) => reg.test(l[0]));
    if (line && /[a-zA-Z0-9]/.test(line[1]))
      return (line[1] || "").trim();
    return "";
  }
};

// src/controllers/infos.controller.ts
var InfosController = (0, import_express.Router)();
InfosController.get("/byId/:id", async (req, res) => {
  var _a, _b;
  const datas = new SlideDatas();
  const infoBox = await datas.getInfoBox(req.params.id);
  const title = ((_a = infoBox == null ? void 0 : infoBox.body) == null ? void 0 : _a.titre) || "";
  const artiste = ((_b = infoBox == null ? void 0 : infoBox.body) == null ? void 0 : _b.artiste) || "";
  const toSearch = title + " " + artiste;
  const img = await datas.getImgWiki(req.params.id);
  let images = [img];
  const imgs = await datas.getImgs(toSearch);
  if (imgs == null ? void 0 : imgs.length)
    images = [...images, ...imgs];
  res.send(__spreadProps(__spreadValues({}, infoBox == null ? void 0 : infoBox.body), { images }));
});
InfosController.get("/byTitle/:title", async (req, res) => {
  const datas = new SlideDatas();
  const images = await datas.getImgs(req.params.title);
  res.send({ images });
});
var infos_controller_default = InfosController;

// src/controllers/search.controller.ts
var import_express2 = require("express");

// src/services/search.service.ts
var import_axios2 = __toESM(require("axios"));
var Search = class {
  constructor(toSearch) {
    this.toSearch = toSearch;
  }
  async getResults() {
    var _a;
    const wikiDatas = await import_axios2.default.get(`https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${this.toSearch}&format=json`);
    const datas = wikiDatas.data;
    const results = wikiDatas.data.query.search.map((el) => {
      const { title, pageid } = el;
      return { title, pageid };
    });
    const hits = (_a = wikiDatas.data.query.searchinfo) == null ? void 0 : _a.totalhits;
    const suggestion = wikiDatas.data.query.searchinfo.suggestion;
    return { hits, suggestion, results };
  }
};

// src/controllers/search.controller.ts
var SearchRouter = (0, import_express2.Router)();
SearchRouter.get("/:toSearch", async (req, res) => {
  const search = new Search(req.params.toSearch);
  const results = await search.getResults();
  res.send(results);
});
var search_controller_default = SearchRouter;

// src/index.ts
var PORT = process.env.PORT || 4e3;
var app = (0, import_express3.default)();
app.use((0, import_cors.default)());
app.use(import_express3.default.json());
app.use(import_express3.default.static(import_path.default.resolve(__dirname, "./client")));
app.get("/", (_, res) => {
  console.log("oe");
  res.sendFile(import_path.default.resolve(__dirname, "./client", "index.html"));
});
app.get("/slide", (_, res) => {
  res.sendFile(import_path.default.resolve(__dirname, "./client", "/slide/slide.html"));
});
app.use("/api/search", search_controller_default);
app.use("/api/infos", infos_controller_default);
app.listen(PORT, () => console.log(`http://loacalhost:${PORT}`));
