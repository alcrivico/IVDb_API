const { Sequelize, DataTypes } = require("sequelize");

const VideogameModel = require("../../../models/Videogame");
const DeveloperModel = require("../../../models/Developer");
const GenreModel = require("../../../models/Genre");
const PlatformModel = require("../../../models/Platform");

describe("Videogame model", () => {
  let sequelize;
  let Videogame;
  let Developer;
  let Genre;
  let Platform;

  beforeAll(async () => {
    sequelize = new Sequelize("sqlite::memory:", { logging: false });

    Platform = PlatformModel(sequelize, DataTypes);
    Genre = GenreModel(sequelize, DataTypes);
    Developer = DeveloperModel(sequelize, DataTypes);
    Videogame = VideogameModel(sequelize, DataTypes);

    Videogame.belongsToMany(Platform, { through: "videogamePlatforms" });
    Platform.belongsToMany(Videogame, { through: "videogamePlatforms" });

    Videogame.belongsToMany(Genre, { through: "videogameGenres" });
    Genre.belongsToMany(Videogame, { through: "videogameGenres" });

    Videogame.belongsToMany(Developer, { through: "videogameDevelopers" });
    Developer.belongsToMany(Videogame, { through: "videogameDevelopers" });

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("Videogame model exists", () => {
    expect(Videogame).toBeDefined();
  });

  test("Videogame has the expected attributes", async () => {
    const videogame = await Videogame.create({
      title: "Test Videogame",
      description: "Test Description",
      realeseDate: new Date(),
      imageRoute: "test.jpg",
    });

    expect(videogame.title).toBe("Test Videogame");
    expect(videogame.description).toBe("Test Description");
    expect(videogame.realeseDate).toBeDefined();
    expect(videogame.imageRoute).toBe("test.jpg");
  });

  test("Videogame has many Platforms", async () => {
    const platform1 = await Platform.create({ name: "Test Platform 1" });
    const platform2 = await Platform.create({ name: "Test Platform 2" });

    const videogame = await Videogame.create({
      title: "Test Videogame",
      description: "Test Description",
      realeseDate: new Date(),
      imageRoute: "test.jpg",
      platforms: [platform1, platform2],
    });

    const platforms = await videogame.getPlatforms();

    expect(platforms.length).toBe(2);
    expect(platforms[0].name).toBe("Test Platform 1");
    expect(platforms[1].name).toBe("Test Platform 2");
  });

  test("Videogame has many Genres", async () => {
    const genre1 = await Genre.create({ name: "Test Genre 1" });
    const genre2 = await Genre.create({ name: "Test Genre 2" });

    const videogame = await Videogame.create({
      title: "Test Videogame",
      description: "Test Description",
      realeseDate: new Date(),
      imageRoute: "test.jpg",
      genres: [genre1, genre2],
    });

    const genres = await videogame.getGenres();

    expect(genres.length).toBe(2);
    expect(genres[0].name).toBe("Test Genre 1");
    expect(genres[1].name).toBe("Test Genre 2");
  });

  test("Videogame has many Developers", async () => {
    const developer1 = await Developer.create({ name: "Test Developer 1" });
    const developer2 = await Developer.create({ name: "Test Developer 2" });

    const videogame = await Videogame.create({
      title: "Test Videogame",
      description: "Test Description",
      realeseDate: new Date(),
      imageRoute: "test.jpg",
      developers: [developer1, developer2],
    });

    const developers = await videogame.getDevelopers();

    expect(developers.length).toBe(2);
    expect(developers[0].name).toBe("Test Developer 1");
    expect(developers[1].name).toBe("Test Developer 2");
  });

  test("Videogame can be updated", async () => {
    const videogame = await Videogame.create({
      title: "Test Videogame",
      description: "Test Description",
      realeseDate: new Date(),
      imageRoute: "test.jpg",
    });

    await videogame.update({
      title: "Updated Videogame",
      description: "Updated Description",
      realeseDate: new Date(),
      imageRoute: "updated.jpg",
    });

    expect(videogame.title).toBe("Updated Videogame");
    expect(videogame.description).toBe("Updated Description");
    expect(videogame.realeseDate).toBeDefined();
    expect(videogame.imageRoute).toBe("updated.jpg");
  });

  test("Videogame can be deleted", async () => {
    const videogame = await Videogame.create({
      title: "Test Videogame",
      description: "Test Description",
      realeseDate: new Date(),
      imageRoute: "test.jpg",
    });

    await videogame.destroy();

    const deletedVideogame = await Videogame.findByPk(videogame.id);

    expect(deletedVideogame).toBeNull();
  });

  test("Videogame can be searched by title", async () => {
    const videogame = await Videogame.create({
      title: "Test Videogame",
      description: "Test Description",
      realeseDate: new Date(),
      imageRoute: "test.jpg",
    });

    const foundVideogame = await Videogame.findOne({
      where: { title: "Test Videogame" },
    });

    expect(foundVideogame.title).toBe("Test Videogame");
  });

  test("Videogame can be searched by id", async () => {
    const videogame = await Videogame.create({
      title: "Test Videogame",
      description: "Test Description",
      realeseDate: new Date(),
      imageRoute: "test.jpg",
    });

    const foundVideogame = await Videogame.findByPk(videogame.id);

    expect(foundVideogame.title).toBe("Test Videogame");
  });

  test("Videogame can be searched by title and updated", async () => {
    const videogame = await Videogame.create({
      title: "Test Videogame",
      description: "Test Description",
      realeseDate: new Date(),
      imageRoute: "test.jpg",
    });

    await Videogame.update(
      { title: "Updated Videogame" },
      { where: { title: "Test Videogame" } }
    );

    const foundVideogame = await Videogame.findOne({
      where: { title: "Updated Videogame" },
    });

    expect(foundVideogame.title).toBe("Updated Videogame");
  });

  test("Videogame can be searched by id and updated", async () => {
    const videogame = await Videogame.create({
      title: "Test Videogame",
      description: "Test Description",
      realeseDate: new Date(),
      imageRoute: "test.jpg",
    });

    await Videogame.update(
      { title: "Updated Videogame" },
      { where: { id: videogame.id } }
    );

    const foundVideogame = await Videogame.findByPk(videogame.id);

    expect(foundVideogame.title).toBe("Updated Videogame");
  });

  test("Videogame can be searched by title and deleted", async () => {
    const videogame = await Videogame.create({
      title: "Test Videogame",
      description: "Test Description",
      realeseDate: new Date(),
      imageRoute: "test.jpg",
    });

    await Videogame.destroy({ where: { title: "Test Videogame" } });

    const deletedVideogame = await Videogame.findOne({
      where: { title: "Test Videogame" },
    });

    expect(deletedVideogame).toBeNull();
  });

  test("Videogame can be searched by id and deleted", async () => {
    const videogame = await Videogame.create({
      title: "Test Videogame",
      description: "Test Description",
      realeseDate: new Date(),
      imageRoute: "test.jpg",
    });

    await Videogame.destroy({ where: { id: videogame.id } });

    const deletedVideogame = await Videogame.findByPk(videogame.id);

    expect(deletedVideogame).toBeNull();
  });
});
