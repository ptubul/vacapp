import { Request, Response } from "express";
import { EntityTarget } from "typeorm";
import { BaseController } from "./base_controller";
import { AuthRequest } from "../common/auth_middleware";
import { ITrips, Trip } from "../entity/trips_model";
//import { Comment } from "../entity/comment_model";
class TripController extends BaseController<ITrips> {
  constructor(entity: EntityTarget<ITrips>) {
    super(entity);
  }

  async post(req: AuthRequest, res: Response): Promise<void> {
    req.body.owner = req.user._id;
    try {
      await super.post(req, res); // Call the correct method from the base class
    } catch (err) {
      res.status(500).send("Error occurred while processing the request");
    }
  }

  async getByOwnerId(req: Request, res: Response) {
    console.log(`get by id: ${req.params.id}`);
    try {
      const ownerId = req.params.id;

      // Use QueryBuilder for more complex queries

      const trips = await this.entity
        .createQueryBuilder("trip")
        .leftJoinAndSelect("trip.owner", "owner")
        .leftJoinAndSelect("trip.likes", "likes") // Join likes
        .leftJoinAndSelect("trip.comments", "comments") // Join comments
        .where("owner._id = :ownerId", { ownerId })
        .getMany();
      if (trips.length > 0) return res.status(200).send(trips);
      res.status(201).send(trips);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }

  async getWithComments(req: Request, res: Response) {
    console.log(`get by id: ${req.params.id}`);
    try {
      const tripId = req.params.id;
      const trip = await this.entity.findOne({
        where: { _id: tripId },
        relations: ["comments", "likes", "owner"],
      });
      if (trip) return res.status(200).send(trip);
      res.status(201).send(trip);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }

  async addComment(req: AuthRequest, res: Response) {
    console.log("addComment");
    try {
      const tripId = req.params.tripId;
      const owner_id = req.user._id;

      const trip = await this.entity.findOne({
        where: { _id: tripId },
        relations: ["comments", "likes"],
      });
      if (!trip) {
        return res.status(404).send("Trip not found");
      }

      console.log("Trip found:", trip);
      console.log("Comment to add:", req.body);

      // Try logging the structure of the comments array before pushing
      console.log("Comments before push:", trip.comments);

      trip.comments.push({
        ownerId: owner_id,
        owner: req.body.owner,
        comment: req.body.comment,
        date: req.body.date,
      });

      console.log("Comments after push:", trip.comments);

      trip.numOfComments = trip.comments.length; // Update the comment count
      await this.entity.save(trip);

      res.status(200).send(trip.comments);
    } catch (error) {
      console.error("Error in addComment:", error.message);
      res.status(500).send(error.message);
    }
  }

  async deleteComment(req: AuthRequest, res: Response) {
    console.log("DeleteComment");
    try {
      const tripId = req.params.tripId;
      const commentId = req.params.commentId;
      const trip = await this.entity.findOne({
        where: { _id: tripId },
        relations: ["comments"],
      });
      if (!trip) {
        return res.status(404).send("Trip not found");
      }
      console.log(`before delete: ${trip}`);
      trip.comments = trip.comments.filter(
        (comment) => comment._id.toString() !== commentId
      );
      trip.numOfComments = trip.comments.length;
      console.log(`after delete: ${trip}`);
      await this.entity.save(trip);

      res.status(200).send(trip.comments);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async addLike(req: AuthRequest, res: Response) {
    try {
      const tripId = req.params.tripId;
      const userId = req.user._id;
      req.body.owner = userId;

      const trip = await this.entity.findOne({
        where: { _id: tripId },
        relations: ["likes"],
      });
      if (!trip) {
        return res.status(404).send("Trip not found");
      }

      if (!trip.likes.some((like) => like.owner === userId)) {
        trip.likes.push({ owner: userId });
        trip.numOfLikes++;
        await this.entity.save(trip);
        return res.status(200).send(trip);
      }
      trip.likes = trip.likes.filter((user) => user.owner !== userId);
      trip.numOfLikes--;
      await this.entity.save(trip);
      return res.status(200).send(trip);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}
export default new TripController(Trip);
