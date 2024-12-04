const { Sequelize, DataTypes } = require("sequelize");

const UserModel = require("../../../models/User");
const RoleModel = require("../../../models/Role");
const ApplicationModel = require("../../../models/Application");

describe("User model", () => {
  let sequelize;
  let User;
  let Role;
  let Application;

  beforeAll(async () => {
    sequelize = new Sequelize("sqlite::memory:", { logging: false });

    Role = RoleModel(sequelize, DataTypes);
    Application = ApplicationModel(sequelize, DataTypes);
    User = UserModel(sequelize, DataTypes);

    User.belongsTo(Role, { foreignKey: { name: "roleId", allowNull: false } });
    Role.hasMany(User, { foreignKey: { name: "roleId", allowNull: false } });

    User.hasOne(Application, {
      foreignKey: { name: "userId", allowNull: false },
    });
    Application.belongsTo(User, {
      foreignKey: { name: "userId", allowNull: false },
    });

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("User model exists", () => {
    expect(User).toBeDefined();
  });

  test("User has the expected attributes", async () => {
    const user = await User.create({
      username: "Test User",
      email: "random@gmail.com",
      password: "123456",
    });

    expect(user.username).toBe("Test User");
    expect(user.email).toBe("random@gmail.com");
  });

  test("User belongs to Role", async () => {
    const role = await Role.create({ name: "Test Role" });
    const user = await User.create({
      username: "Test User",
      email: "random2@gmail.com",
      password: "123456",
      roleId: role.id,
    });

    expect(user.roleId).toBe(role.id);
  });

  test("User can be associated with an Application", async () => {
    const user = await User.create({
      username: "Test User",
      email: "random3@gmail.com",
    });

    const application = await Application.create({
      userId: user.id,
      request: "Test Request",
    });

    expect(application.userId).toBe(user.id);
  });
});
