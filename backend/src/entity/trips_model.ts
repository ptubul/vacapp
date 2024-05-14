// export interface ITrips {
//   _id?: string;
//   owner?: string;
//   userName?: string;
//   imgUrl?: string;
//   typeTraveler: string;
//   country: string;
//   typeTrip: string;
//   numOfDays: number;
//   tripDescription: string[];
//   numOfComments: number;
//   numOfLikes: number;
//   tripPhotos?: string[];

//   comments?: Array<{
//     _id?: string;
//     ownerId: string;
//     owner: string;
//     comment: string;
//     date: Date;
//   }>;

//   likes?: Array<{
//     owner: string;
//   }>;
// }

// import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";

// @Entity()
// export class Like {
//     @PrimaryGeneratedColumn("uuid")
//     _id: string;

//     @Column({ type: "varchar", length: 255 })
//     owner: string;

//     @ManyToOne(() => Trip, trip => trip.likes)
//     trip: Trip;
// }

// @Entity()
// export class Comment {
//     @PrimaryGeneratedColumn("uuid")
//     _id: string;

//     @Column({ type: "varchar", length: 255 })
//     ownerId: string;

//     @Column({ type: "varchar", length: 255 })
//     owner: string;

//     @Column({ type: "varchar" })
//     comment: string;

//     @Column({ type: "date" })
//     date: Date;

//     @ManyToOne(() => Trip, trip => trip.comments) // Define Many-to-One relationship
//     trip: Trip; // Add this property
// }

// @Entity()
// export default class Trip {
//     @PrimaryGeneratedColumn("uuid")
//     _id: string;

//     @Column({ type: "varchar", length: 255 })
//     owner: string;

//     @Column({ type: "varchar", length: 255, nullable: true })
//     userName: string;

//     @Column({ type: "varchar", nullable: true })
//     imgUrl: string;

//     @Column({ type: "varchar" })
//     typeTraveler: string;

//     @Column({ type: "varchar" })
//     country: string;

//     @Column({ type: "varchar" })
//     typeTrip: string;

//     @Column({ type: "int" })
//     numOfDays: number;

//     @Column("simple-array", { nullable: true })
//     tripPhotos: string[];

//     @Column("simple-array")
//     tripDescription: string[];

//     @OneToMany(() => Comment, comment => comment.trip)
//     comments: Comment[];

//     @Column({ type: "int", default: 0 })
//     numOfComments: number;

//     @OneToMany(() => Like, like => like.trip)
//     likes: Like[];

//     @Column({ type: "int", default: 0 })
//     numOfLikes: number;
// }
