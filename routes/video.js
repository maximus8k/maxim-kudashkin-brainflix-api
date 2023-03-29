const express = require('express')
const fs = require('fs')
const router = express.Router()
const uniqid = require("uniqid");


function readVideos() {
    const videosJson = fs.readFileSync('./data/videos.json');
    const parsedVideos = JSON.parse(videosJson);
    return parsedVideos;
}


router.get('/videos', (req, res) => {
    res.json(readVideos());
})


router.get("/videos/:id", (req, res) => {
    const videos = readVideos();


    const singlevideo = videos.find((video) =>
        video.id === req.params.id);
    res.json(singlevideo);

})


router.post("/videos", (req, res ) => {

    const imagePath = "http://localhost:8080/images/nature-photo.jpeg"


    const updateVideo = {
        id: uniqid(),
        title: req.body.title,
        description: req.body.description,
        image: imagePath,
        channel: "User",
        views: "125",
        likes: "17",
        video: "https://project-2-api.herokuapp.com/stream",
        timestamp: Date.now(),
        duration: "4:50",
        comments: [
        ]
    }

    const videos = readVideos();
    videos.push(updateVideo);
    fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
    res.status(200).json(updateVideo);
})


router.post("/videos/:id/comments", (req, res) => {

    const updateComment = {
        id: uniqid(),
        name: "User",
        comment: req.body.comment,
        timestamp: Date.now()
    }    

    const videos = readVideos();
    const index = videos.findIndex((video) => video.id === req.params.id);
    videos[index].comments.push(updateComment);
    fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
    res.status(200).json(updateComment);

})

router.delete("/videos/:id/comments/:commentId", (req, res) => {
    const videoId = req.params.id;
    const commentId = req.params.commentId;


    const videos = readVideos();
    const video = videos.find((video) => video.id === videoId);
    if (!video) {
        res.status(404).json({ message: "No video with that id exists" });
    } else {
        const commentIndex = video.comments.findIndex((comment) => comment.id === commentId);
        if (commentIndex === -1) {
            res.status(404).json({ message: "Comment not found" });
        } else {
            const deletedComment = video.comments.splice(commentIndex, 1)[0];
            fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
            res.status(200).json(deletedComment);
        }
    }
});


router.put("/videos/:id/likes", (req, res) => {
    const videoId = req.params.id;
    const videos = readVideos();
    const videoIndex = videos.findIndex((video) => video.id === videoId);
    if (videoIndex === -1) {
        res.status(404).json({ message: "No video with that id exists" });
    } else {
        const video = videos[videoIndex];
        console.log(video.likes);
        video.likes++;
        console.log(video.likes);

        fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
        res.status(200).json(video);
    }
});

module.exports = router;

