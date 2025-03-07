/**
 * Message Service 💌
 */
import { ChatMessageData } from "@shared/types/SocketEvents.types";
import prisma from "../prisma";

/**
 * Get latest messages sent to a room
 *
 * @param roomId Room ID
 * @returns Messages
 */

export const getLatestMessagesByRoom = (roomId: string, maxAge = 3600) => {
	const past = Date.now() - maxAge * 1000;

	return prisma.message.findMany({
		where: {
			roomId,
			timestamp: {
				gte: past,   // timestamp >= past
			},
		},
		orderBy: {
			timestamp: "asc",
		},
		take: -100,
	});
}

/**
 * Create (save) a message
 *
 * @param data Message
 * @returns Message
 */
export const createMessage = (data: ChatMessageData) => {
	return prisma.message.create({
		data,
	});
}
