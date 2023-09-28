import PostModel from "../models/Post.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({ path: "author", select: ["fullName", "avatarUrl"] })
      .sort({ createdAt: "descending" })
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
    const tags = Object.values(req.body.tags);
    console.log(typeof tags);
    console.log(tags);
    const preparedTags = tags.map((item) => item.toLowerCase());
    console.log(preparedTags);
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: preparedTags,
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
    const preparedTags = req.body.tags.map((item) => item.toLowerCase());
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: preparedTags,
      author: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось создать статью" });
  }
};

export const getPopularTags = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ viewsCount: "descending" })
      .limit(3)
      .exec();

    const tags = [...new Set(posts.map((post) => post.tags).flat(Infinity))];
    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить тэги" });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const tag = req.params.tag.toLowerCase();
    const posts = await PostModel.find()
      .where("tags")
      .equals(tag)
      .populate({ path: "author", select: ["fullName", "avatarUrl"] })
      .sort({ createdAt: "descending" })
      .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};
