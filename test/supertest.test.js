import chai from "chai";
import supertest from "supertest";
import app from "../app.js";
import session from "supertest-session";
import { faker } from "@faker-js/faker";

const expect = chai.expect;
const requester = supertest("localhost:8080");
const testSession = session(app);

let newUser;

before(async () => {
  // Genera un usuario con faker
  newUser = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    age: faker.number.int(80),
  };
});

describe("Prueba de ecommerce", () => {
  describe("Registro, logeo, current  y switch de rol de Usuarios", () => {
    let userId;

    it("Endpoint /api/session/register - POST - Debe registrar un usuario", async () => {
      // Registra un usuario
      const res = await requester.post("/api/session/register/").send(newUser);

      if (res.status === 302) {
        const redirectLocation = res.header["location"];

        if (redirectLocation.endsWith("/failregister")) {
          // Si se redirigió a failregister, la prueba falla
          expect.fail(
            "La solicitud fue redirigida a failregister, no se creó el usuario"
          );
        } else if (redirectLocation.endsWith("/login")) {
          // Si se redirigió a login, la prueba es exitosa
          expect(true).to.equal(true); // Esto es solo para que la prueba pase
        }
      } else {
        // Si no hubo redirección, la prueba falla
        expect.fail("No hubo redirección");
      }
    });

    it("Endpoint /api/session/login - POST - Debe logear al usuario y devolver sus datos personales", async () => {
      const loginResponse = await testSession.post("/api/session/login").send({
        email: newUser.email,
        password: newUser.password,
      });

      // Verifica que el inicio de sesión sea exitoso
      expect(loginResponse.status).to.equal(302);

      // Verifica que se haya redirigido a la página de productos
      expect(loginResponse.header["location"]).to.equal("/products");

      // Hacer una solicitud de sus datos
      const currentResponse = await testSession.get("/api/session/current");

      // Verifica la respuesta
      expect(currentResponse.status).to.equal(200);
      expect(currentResponse.body).to.have.property("status", "success");
      expect(currentResponse.body).to.have.property("payload");

      // Verifica que los datos del usuario sean correctos
      const userData = currentResponse.body.payload;
      expect(userData.email).to.equal(newUser.email);
      userId = userData._id;
    });

    it("Endpoint /api/users/premium - GET - Debe cambiar el rol del usuario a premium y luego volver a user", async () => {
      // Realiza una solicitud GET para cambiar el rol del usuario
      const changeRoleResponse = await testSession.get(
        `/api/users/premium/${userId}`
      );

      // Verifica que la respuesta sea exitosa
      expect(changeRoleResponse.status).to.equal(200);

      // Verifica que el rol del usuario haya cambiado a premium
      const userChangeRole = await testSession.get("/api/session/current");
      expect(userChangeRole.body.payload.role).to.equal("premium");

      // Realiza otra solicitud GET para volver a cambiar el rol
      const revertRoleResponse = await testSession.get(
        `/api/users/premium/${userId}`
      );

      // Verifica que la segunda respuesta sea exitosa
      expect(revertRoleResponse.status).to.equal(200);

      // Verifica que el rol haya vuelto a ser user
      const userRevertRole = await testSession.get("/api/session/current");
      expect(userRevertRole.body.payload.role).to.equal("user");
    });
  });

  describe("Test de Products", () => {
    const product = {
      title: "Iphone 15",
      description: "Apple Iphone 15 512GB GREY",
      price: 1500,
      thumbnails:
        "https://www.infobae.com/new-resizer/lDey20gJirpEk3Ck_n0-Wg_ahqg=/arc-anglerfish-arc2-prod-infobae/public/R7L7KQAKSBBX7CC2KCOKUPNAEM.jpg",
      stock: 5,
      category: "phone",
      code: "AI15",
    };

    it("Endpoint /api/products - GET - Debe obtener todos los productos", async () => {
      // Realiza una solicitud GET a /api/products
      const response = await testSession.get("/api/products");

      // Verifica que la respuesta sea exitosa (código 200)
      expect(response.status).to.equal(200);

      // Verifica que la respuesta tenga la propiedad 'products'
      expect(response.body).to.have.property("products");

      // Verifica que la propiedad 'products' sea un array
      expect(response.body.products).to.be.an("array");

      // Verifica que al menos un producto esté presente
      expect(response.body.products.length).to.be.greaterThan(0);
    });

    it("Endpoint /api/products/:pid GET - Debe obtener un producto por su ID", async () => {
      const productId = "648e5e2148088ca60ac11585";

      // Realiza una solicitud GET a /api/products/:pid
      const response = await testSession.get(`/api/products/${productId}`);

      // Verifica que la respuesta sea exitosa (código 200)
      expect(response.status).to.equal(200);

      // Verifica que la respuesta tenga la propiedad 'product'
      expect(response.body).to.have.property("product");

      // Verifica que el producto devuelto tenga el ID correcto
      expect(response.body.product._id).to.equal(productId);
    });

    it("Endpoint /api/products - POST - Debe agregar un producto", async () => {
      const login = await testSession.post("/api/session/login").send({
        email: "test@test.com",
        password: "p4ssw0rd",
      });

      // Verifica que el inicio de sesión sea exitoso
      expect(login.status).to.equal(302);

      // Verifica que se haya redirigido a la página de productos
      expect(login.header["location"]).to.equal("/products");

      // Realiza una solicitud POST a /api/products
      const response = await testSession.post("/api/products").send(product);
      // Verifica que la respuesta sea exitosa
      expect(response._body.status).to.be.equal("success");
    });

    it("Endpoint /api/products/:pid PUT - Debe modificar un campo del producto por su ID", async () => {
      // Suponiendo que 'productId' es el ID válido de un producto en tu base de datos
      const productId = "some_valid_product_id";

      // Suponiendo que 'newField' es el campo que quieres modificar
      const newFieldValue = "nuevo_valor";

      // Realiza una solicitud PUT a /api/products/:pid
      const response = await testSession
        .put(`/api/products/${productId}`)
        .send({ field: newFieldValue });

      // Verifica que la respuesta sea exitosa (código 200)
      expect(response.status).to.equal(200);

      // Verifica que el estado de la respuesta sea 'success'
      expect(response.body.status).to.equal("successful");

      // Verifica el mensaje de éxito
      expect(response.body.msg).to.equal("Producto modificado correctamente");
    });
  });
});
