import PostModel from "../models/Post.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({ path: "author", select: ["fullName", "avatarUrl"] })
      .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    )
      .populate({ path: "author", select: ["fullName", "avatarUrl"] })
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({ message: "Статья не найдена" });
        }

        res.json(doc);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ message: "Не удалось получить статью", err });
      });

    // (err, doc) => {
    //   if (err) {
    //     return res.status(500).json({ message: "Не удалось получить статью" });
    //   }

    //   if (!doc) {
    //     return res.status(404).json({ message: "Статья не найдена" });
    //   }

    //   res.json(doc);
    // };
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить статью" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndRemove({
      _id: postId,
    })
      .then(res.json({ success: true }))
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Не удалось удалить статью" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось удалить статью" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        author: req.userId,
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось обновить статью" });
  }
};

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      author: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось создать статью" });
  }
};
