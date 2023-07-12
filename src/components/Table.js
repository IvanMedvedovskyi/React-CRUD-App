import React from "react";
import "./table.css";

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      changeMode: false,
      editPostId: null,
      editUserId: null,
      editTitle: "",
      editBody: "",
    };
  }

  fetchRequest = () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((posts) => this.setState({ posts }))
      .catch((error) => console.log(error));
  };

  componentDidMount() {
    this.fetchRequest();
  }

  EditBtnHandler = (userId, id, title, body) => {
    this.setState({
      changeMode: true,
      editPostId: id,
      editTitle: title,
      editBody: body,
      editUserId: userId,
    });
  };

  DeleteBtnHandler = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    })
      .then((data) => {
        if (data.ok) {
          const filterPosts = this.state.posts.filter((post) => post.id !== id);
          this.setState({ posts: filterPosts });
        }
      })
      .catch((error) => console.log(error));
  };

  SaveBtnHandler = () => {
    const { editPostId, editTitle, editBody, editUserId } = this.state;

    const updatedPost = {
      userId: editUserId,
      id: editPostId,
      title: editTitle,
      body: editBody,
    };

    fetch(`https://jsonplaceholder.typicode.com/posts/${editPostId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPost),
    })
      .then((response) => response.json())
      .then((updatedPost) => {
        const updatedPosts = this.state.posts.map((post) =>
          post.id === editPostId ? updatedPost : post
        );

        this.setState({
          posts: updatedPosts,
          changeMode: false,
          editTitle: "",
          editBody: "",
          editPostId: null,
        });
      })
      .catch((error) => console.log(error));
  };

  CancelBtnHandler = () => {
    this.setState({ changeMode: false });
  };

  render() {
    const { posts, changeMode, editTitle, editBody } = this.state;

    return (
      <div>
        {changeMode ? (
          <div className="editTable">
            <div className="editCountainer">
              <label>Edit title:</label>
              <textarea
                type="text"
                value={editTitle}
                onChange={(event) =>
                  this.setState({ editTitle: event.target.value })
                }
              ></textarea>

              <label>Edit body:</label>
              <textarea
                type="text"
                value={editBody}
                onChange={(event) =>
                  this.setState({ editBody: event.target.value })
                }
              ></textarea>

              <button onClick={this.SaveBtnHandler}>SaveChanges</button>
              <button onClick={this.CancelBtnHandler}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="div_table">
            <table className="tableCountainer">
              <thead>
                <tr>
                  <th>UserID</th>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Body</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.userId}</td>
                    <td>{post.id}</td>
                    <td>{post.title}</td>
                    <td>{post.body}</td>
                    <td>
                      <button
                        className="glow-button"
                        onClick={() =>
                          this.EditBtnHandler(
                            post.userId,
                            post.id,
                            post.title,
                            post.body
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="glow-button"
                        onClick={() => this.DeleteBtnHandler(post.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default Table;
