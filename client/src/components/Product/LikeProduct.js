import React, { Component } from "react";
import withSession from "../withSession";
import { Mutation } from "react-apollo";
import { LIKE_PRODUCT, GET_PRODUCT, UNLIKE_PRODUCT } from "../../queries/index";

class LikeProduct extends Component {
  state = {
    username: "",
    liked: false
  };

  componentDidMount() {
    if (this.props.session.getCurrentUser) {
      const { username, favorites } = this.props.session.getCurrentUser;
      const { _id } = this.props;
      const prevLiked =
        favorites.findIndex(favorite => favorite._id === _id) > -1;
      this.setState({ liked: prevLiked, username: username });
    }
  }

  handleClick = (likeProduct, unlikeProduct) => {
    this.setState(
      prevState => ({
        liked: !prevState.liked
      }),
      () => this.handleLike(likeProduct, unlikeProduct)
    );
  };

  handleLike = (likeProduct, unlikeProduct) => {
    if (this.state.liked) {
      likeProduct().then(async ({ data }) => {
        // console.log(data);
        await this.props.refetch();
      });
    } else {
      unlikeProduct().then(async ({ data }) => {
        // console.log(data);
        await this.props.refetch();
      });
    }
  };

  updateLike = (cache, { data: { likeProduct } }) => {
    const { _id } = this.props;
    const { getProduct } = cache.readQuery({
      query: GET_PRODUCT,
      variables: { prodId: _id }
    });

    cache.writeQuery({
      query: GET_PRODUCT,
      variables: { prodId: _id },
      data: {
        getProduct: { ...getProduct, likes: likeProduct.likes + 1 }
      }
    });
  };

  updateUnlike = (cache, { data: { unlikeProduct } }) => {
    const { _id } = this.props;
    const { getProduct } = cache.readQuery({
      query: GET_PRODUCT,
      variables: { prodId: _id }
    });

    cache.writeQuery({
      query: GET_PRODUCT,
      variables: { prodId: _id },
      data: {
        getProduct: { ...getProduct, likes: unlikeProduct.likes - 1 }
      }
    });
  };

  render() {
    const { username, liked } = this.state;
    const { _id } = this.props;
    return (
      <Mutation
        mutation={UNLIKE_PRODUCT}
        variables={{ _id, username }}
        update={this.updateUnlike}
      >
        {unlikeProduct => (
          <Mutation
            mutation={LIKE_PRODUCT}
            variables={{ _id, username }}
            update={this.updateLike}
          >
            {likeProduct =>
              username && (
                <button
                  className="like-button"
                  onClick={() => this.handleClick(likeProduct, unlikeProduct)}
                >
                  {liked ? "Unlike" : "Like"}
                </button>
              )
            }
          </Mutation>
        )}
      </Mutation>
    );
  }
}
export default withSession(LikeProduct);
