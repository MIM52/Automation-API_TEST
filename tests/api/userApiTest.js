// Load the axios library ( Axios Library untuk membuat HTTP request ke API.)
const axios = require("axios");
// Load the chai assertion library (Library untuk assertion (pembanding hasil ekspektasi dengan hasil aktual)).
const { expect } = require("chai");

// API URL and headers
// API_URL : Alamat endpoint API GoRest untuk operasi CRUD pengguna.
const API_URL = "https://gorest.co.in/public/v2/users/";

//headers : Header otentikasi menggunakan Bearer Token (diambil dari variabel lingkungan process.env.GOREST_TOKEN)
const headers = {
  Authorization: `Bearer ${process.env.GOREST_TOKEN}`,
  "Content-Type": "application/json",
};

// Test Suite (Menggunakan Mocha untuk membuat skrip pengujian).

// describe() : Mengelompokkan beberapa tes dalam satu skema.
describe("API Automation - GoRest", () => {

  // Variable to store the userId
  // Menyimpan ID pengguna yang dibuat untuk operasi berikutnya
  let userId;

  // List User  (Positive Test) 
  // it() : Mendefinisikan satu kasus uji.
  it("List user details (Positive Test)", async () => {

    //Using Axios to get the response 
    // Mengambil daftar pengguna API. HTTP GET ke API_URL dengan header autentikasi.  
    const response = await axios.get(`${API_URL}`, { headers });

    //Check log the response data
    //Log data pengguna ke konsol.
    console.log("List User", response.data);

    //Check the response status (chai assertion)
    // Verifikasi respons status 200 OK.
    expect(response.status).to.equal(200);
  });

  // Create User (Positive Test)
  it("Create a new user (Positive Test)", async () => {
  
    //Create user data
    // membuat pengguna baru dan menyimpan userId untuk tes berikutnya.
    const userData = {
      name: "irfan",
      gender: "male",
      email: `irfan@gmail.com`,
      status: "active",
    };

    //Using Axios to post the response
    // HTTP POST ke API_URL dengan data pengguna dan header.
    const response = await axios.post(API_URL, userData, { headers });

    //Check log the response data
    console.log("Create User", response.data);

    //Check the response status and have id? (chai assertion)
    // Verifikasi respons status 201 Created dan adanya properti id.
    expect(response.status).to.equal(201);
    expect(response.data).to.have.property("id");

    // Simpan userId dari respons untuk digunakan di tes berikutnya.
    userId = response.data.id;
  });

  // Get User (Positive Test)
  //  Untuk mengambil detail pengguna berdasarkan userId.
  it("Get user details (Positive Test)", async () => {

    //Using Axios to get the response
    // Kirim HTTP GET ke API_URL/${userId}.
    const response = await axios.get(`${API_URL}/${userId}`, { headers });

    //Check log the response data
    console.log("Get User", response.data);

    //Check the response status and id (chai assertion)
    // Verifikasi respons status 200 OK dan kesesuaian id dengan userId.
    expect(response.status).to.equal(200);
    expect(response.data.id).to.equal(userId);
  });

  // Update User (Positive Test)
  // Fungsi : Memperbarui data pengguna (nama dan status).
  it("Update user details (Positive Test)", async () => {
    //Update user data
    const updateData = { name: "Irfan", status: "inactive" };

    //Using Axios to put the response
    const response = await axios.put(`${API_URL}/${userId}`, updateData, {
      headers,
    });

    //Check log the response data
    console.log("Update User", response.data);

    //Check the response status (chai assertion)
    //Verifikasi respons status 200 OK.
    expect(response.status).to.equal(200);
  });

  // Delete User (Positive Test)
  // Fungsi : Menghapus pengguna berdasarkan userId.
  it("Delete user (Positive Test)", async () => {

    //Using Axios to delete the response
    // Kirim HTTP DELETE ke API_URL/${userId}.
    const response = await axios.delete(`${API_URL}/${userId}`, { headers });

    //Check log the response data
    console.log("Delete User", response.data);

    //Check the response status (chai assertion)
    // Verifikasi respons status 204 No Content.
    expect(response.status).to.equal(204);
  });

  // Negative Test - Get User
  // Fungsi : Memverifikasi respons 404 Not Found untuk pengguna yang tidak ada.
  it("Get non-existing user (Negative Test)", async () => {

    //Using Axios catch to get the response
    // Kirim HTTP GET ke ID pengguna yang tidak ada (9999999).
    // Tangkap error menggunakan .catch()  dan verifikasi status 404.
    const response = await axios
      .get(`${API_URL}/9999999`, { headers })
      .catch((err) => err.response);

    //Check log the response data
    console.log("Get Non-Existing User", response.data);

    //Check the response status (chai assertion)
    expect(response.status).to.equal(404);
  });
});
