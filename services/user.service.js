
class UserService {
  constructor(){

  }

  async create(data) {

  }

  async find() {
    const nombres = {
      name: "David Hernandez",
      cel: 3103667414,
      kiy: "Juan Perez"
    }
    const data = {
      ...nombres,
      kiy: "lopez",
      user: {
        name: "leche de vaca"
      }
    }
    return data;
  }

  async findOne(id) {
    return []
  }

  async update(id, changes) {

  }
  async delete(id) {

  }
}

module.exports = UserService;
