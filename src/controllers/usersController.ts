import { usersRepository }  from '../repositories/usersRepository.js';

async function getUser(req, res){
    const id = res.locals.dados.id
    try{
      const user = await usersRepository.getById(id)
      if(!user){ return res.sendStatus(401)
      }else{
        res.status(200).send({
            id: user.id,
            email:user.email,
            username:user.username,
            pictureUrl:user.pictureUrl,
            createdAt:user.createdAt})
      }
      }catch(error){
        console.log(error)
        res.sendStatus(400)
      }  
};

async function getUsersByName (req, res) {
    const userId = res.locals.dados.id;
    const name = req.params.name;

    try {
        const { rows: dbUsers } = await usersRepository.getUserByName(name, userId);

        res.status(200).send(dbUsers);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function getUserById(req, res, next){

    const { id } = req.params;

    try {
        
        const userData = await usersRepository.getById(id);
        if(!userData) return res.sendStatus(404);
        const { username, pictureUrl } = userData;
        res.send({ username, pictureUrl });

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getUserId(req, res) {
    const id = { id: res.locals.dados.id };

    try {
        res.status(200).send(id);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function checkIfUserIsFollowing(req, res, next){

    const { id } = req.params;
    const userId = res.locals.dados.id;

    try {
        
        const isFollowing = await usersRepository.isFollowing(userId, id);
        res.send(isFollowing);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

async function follow(req, res, next){

    const { id: userId } = req.params;
    const logedUserId = res.locals.dados.id;

    try {
        
        const isFollowing = await usersRepository.isFollowing(logedUserId, userId);
        if(isFollowing) return res.sendStatus(409);
        await usersRepository.followUser(logedUserId, userId);
        res.sendStatus(201);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

async function unfollow(req, res, next){

    const { id: userId } = req.params;
    const logedUserId = res.locals.dados.id;

    try {
        
        const isFollowing = await usersRepository.isFollowing(logedUserId, userId);
        if(!isFollowing) return res.sendStatus(409);
        await usersRepository.unfollowUser(logedUserId, userId);
        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }


}

export {
    getUser,
    getUsersByName,
    getUserById,
    getUserId,
    checkIfUserIsFollowing,
    follow,
    unfollow
}