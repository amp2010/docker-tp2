import React, { Component } from "react";
import axios from "axios";

class App extends Component {

  state = {
    data: [],
    userId: null,
    firstname: null,
    lastname: null,
    intervalIsSet: false,
    idToDelete: null
  };

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // GET
  getDataFromDb = () => {
    fetch("/api/users")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }))
      .catch(err => {
          console.log("Could'nt get data from API :" + err);
      });
  };

  // POST
  putDataToDB = (userId, firstname, lastname) => {
    axios.post("/api/user", {
      userId: userId,
      firstname: firstname,
      lastname: lastname
    });
  };

  // DELETE
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("/api/user", {
      data: {
        id: objIdToDelete
      }
    });
  };

  // UI
  render() {
    const { data } = this.state;
    return (
      <div style={{ padding: "30px 20%" }}>
        <div id="insert-container">
          <h3>Insert a user in the database: </h3>
          <input
            type="text"
            className="form-control"
            onChange={e => this.setState({ userId: e.target.value })}
            placeholder="User Id"
            style={{ width: "200px" }}
          />
	      <input
            type="text"
            className="form-control"
            onChange={e => this.setState({ firstname: e.target.value })}
            placeholder="Firstname"
            style={{ width: "200px" }}
          />
	      <input
            type="text"
            className="form-control"
            onChange={e => this.setState({ lastname: e.target.value })}
            placeholder="Lastname"
            style={{ width: "200px" }}
          />
          <br/>
          <button
            onClick={() => this.putDataToDB(this.state.userId, this.state.firstname, this.state.lastname)}
            className="btn btn-success" >
            ADD
          </button>
        </div>
        <br/>
        <br/>
        <div id="delete-container">
          <h3>Delete a user from the database: </h3>
          <input
            type="text"
            style={{ width: "200px" }}
            className="form-control"
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="User id to delete"
          />
          <br/>
          <button
            onClick={() => this.deleteFromDB(this.state.idToDelete)}
            className="btn btn-danger">
            DELETE
          </button>
        </div>
        <br/>
        <br/>
        <div id="db-result-container">
          {data.length <= 0
          ? <h3>Your database is currently empty, add some user to it !</h3>
          : data.map(dat => (
            <ul>
              <li style={{ padding: "10px" }} key={data.firstname}>
                <span style={{ color: "gray" }}> User Id: </span> {dat.userId} <br />
                <span style={{ color: "gray" }}> Firstname: </span> {dat.firstname} <br />
                <span style={{ color: "gray" }}> Lastname: </span> {dat.lastname}
              </li>
            </ul>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
