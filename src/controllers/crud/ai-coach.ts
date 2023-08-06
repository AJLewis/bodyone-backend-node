import express, {NextFunction, Request, Response} from 'express';
import AICoachChatModel from '../../models/AICoachChat.model';
import axios from 'axios';

// TODO: Implement functions and function calls in the api. 
// TODO: Update the ChatMessageModel to include a function field, functionCall field and show buttons.

export const startConversation = async (
    req: Request,
    res: Response,
    next?: NextFunction
) => {
    try {
        console.log('starting conversation');
        const {userId, aiCoachName, initialMessage} = req.body;
        const conversation = new AICoachChatModel({
            user: userId,
            aiCoachName,
            messages: [
                {
                    from: 'user',
                    body: initialMessage,
                    createdAt: Date.now(),
                },
            ],
        });

        await conversation.save();

        res.status(201).json({
            message: 'Conversation started successfully',
            conversation,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while processing your request.',
        });
    }
};

export const addMessage = async (
    req: Request,
    res: Response,
    next?: NextFunction
) => {
    try {
        const {conversationId, from, body} = req.body;
        const conversation = await AICoachChatModel.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({error: 'Conversation not found.'});
        }

        conversation.messages.push({
            from,
            body,
            createdAt: new Date(),
        });
        await conversation.save();

        const aiRequest = {
            messages: conversation.messages.map((message) => ({
                role: message.from.toLowerCase(),
                content: message.body,
            })),
            model: 'gpt-3.5-turbo-0613',
            maxTokens: 2000, // optional, replace with your max tokens if different
        };

        const aiResponse = await axios.post(
            'http://localhost:5001/api/private/openai/chat',
            aiRequest,
            {
                headers: {
                    Authorization: `Bearer ${process.env.SHARED_SECRET}`,
                },
            }
        );

        console.log(aiResponse);

        conversation.messages.push({
            from: aiResponse.data.response.choices[0].message.role,
            body: aiResponse.data.response.choices[0].message.content, // assuming the AI's message is in the 'choices[0].message.content' property of the response data
            createdAt: new Date(),
        });

        await conversation.save();

        res.status(200).json({
            message: 'Message added successfully',
            conversation,
        });
    } catch (error: any) {
        res.status(500).json({error: error.response.data});
    }
};

export const getConversation = async (
    req: Request,
    res: Response,
    next?: NextFunction
) => {
    try {
        const {conversationId} = req.params;
        const conversation = await AICoachChatModel.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({error: 'Conversation not found.'});
        }

        res.status(200).json({
            message: 'Conversation retrieved successfully',
            conversation,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while processing your request.',
        });
    }
};

export const getAllConversationsForUser = async (
    req: Request,
    res: Response,
    next?: NextFunction
) => {
    try {
        const {userId} = req.params;
        const conversations = await AICoachChatModel.find({user: userId});
        if (!conversations) {
            return res
                .status(404)
                .json({error: 'No conversations found for this user.'});
        }

        res.status(200).json({
            message: 'Conversations retrieved successfully',
            conversations,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while processing your request.',
        });
    }
};

export const deleteConversation = async (
    req: Request,
    res: Response,
    next?: NextFunction
) => {
    try {
        const {conversationId} = req.params;
        const conversation = await AICoachChatModel.findByIdAndDelete(
            conversationId
        );
        if (!conversation) {
            return res.status(404).json({error: 'Conversation not found.'});
        }

        res.status(200).json({
            message: 'Conversation deleted successfully',
            conversation,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while processing your request.',
        });
    }
};
