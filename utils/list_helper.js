const dummy = blogs =>{
    return 1
}

const totalLikes = blogs =>{
    const likes = blogs.reduce((total, blog) => {
        return total + blog.likes;
    }, 0);
    return likes;
}

const favoriteBlog = blogs =>{
    const favorite = blogs.reduce((maxLikes,currentBlog)=>{
        return maxLikes.likes > currentBlog.likes ? maxLikes : currentBlog
    }, blogs[0])
    return favorite
}

module.exports = { 
    dummy,
    totalLikes,
    favoriteBlog
}