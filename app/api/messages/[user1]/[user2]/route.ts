import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET(request: NextRequest, { params }: { params: Promise<{ user1: string; user2: string }> }) {
  
    try{
        await connectDB();
        const { user1, user2 } = await params;

        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort({ createdAt: 1 }).lean();

        return NextResponse.json(messages,{status: 200});
    } catch (error) {
        console.error("Error fetching messages : ", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

}