import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chatSystemInstruction = `You are "E-Wasted Assistant", a friendly, helpful, and slightly enthusiastic AI guide for an e-waste recycling company named E-Wasted. Your primary goal is to provide concise and accurate information to users.

Your responsibilities are:
1.  Answer questions about E-Wasted's services (Secure Data Destruction, Corporate Solutions, Residential Drop-off, Component Recovery).
2.  Clarify what types of e-waste are accepted (e.g., laptops, phones, TVs, appliances, cables, batteries).
3.  Explain the recycling process simply (Collection -> Sorting -> Data Sanitization -> Recycling).
4.  Reassure users about data security, mentioning certified data destruction.
5.  Gently guide users towards scheduling a pickup by directing them to the contact form on the page if they seem ready.
6.  If a user asks about points or rewards, explain that the rewards program is currently unavailable but they are contributing to a great environmental cause.
7.  If you don't know an answer, politely say so and suggest they use the contact form for specific inquiries.
8.  If a user asks about business analytics, explain that companies can contact us for tailored reports on their recycling impact.
9.  If a user asks how to wipe data from a device, explain the importance of data security and guide them to use the "Data Security Advisor" tool on the homepage for detailed, AI-powered instructions.

Keep your answers brief and to the point, ideally 2-3 sentences. Do not invent services or policies. Be positive and encouraging about recycling.`;

let chat;

export const startChat = () => {
    if (chat) return;

    if (!process.env.API_KEY) {
        console.log("Mock chat session started as API_KEY is not set.");
        return;
    }

    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: chatSystemInstruction,
          thinkingConfig: { thinkingBudget: 0 }
        },
    });
};

export const sendMessage = async (message) => {
    if (!process.env.API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `This is a mock AI response about "${message}". The API key is not configured.`;
    }

    if (!chat) {
      startChat();
    }

    try {
        const response = await chat.sendMessage({ message });
        return response.text.trim();
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "I'm sorry, but I encountered an error. Please try again in a moment.";
    }
};

export const generateContactResponse = async (name, service) => {
  if (!process.env.API_KEY) {
    return `Thank you for your message, ${name}! We've received your inquiry regarding our ${service} service and a member of our team will get back to you within 24 hours. We appreciate you reaching out to E-Wasted.`;
  }
  
  try {
    const prompt = `Generate a friendly, professional, and reassuring confirmation message for a user named "${name}" who just submitted a contact form on our e-waste recycling website, 'E-Wasted'. They are interested in our "${service}" service. Mention that we've received their inquiry and will respond soon regarding their request. Keep it concise, under 60 words.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    
    return response.text.trim();

  } catch (error) {
    console.error("Error generating contact response from Gemini:", error);
    // Fallback message in case of API error
    return `Thank you for your message, ${name}! We have received your inquiry about our ${service} service and will be in touch shortly. Your commitment to responsible recycling is greatly appreciated.`;
  }
};

export const identifyEWaste = async (base64Image, mimeType) => {
  if (!process.env.API_KEY) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return JSON.stringify({
      itemName: 'Old Laptop',
      category: 'Computers & Laptops',
      recyclable: true,
    });
  }

  try {
    const prompt = `You are an expert in e-waste identification for a recycling company. Analyze the image and identify the primary electronic waste item.

    Respond only with a single, valid JSON object that conforms to the provided schema.

    - "itemName": The common name of the item (e.g., "iPhone 11", "Dell Laptop", "Microwave Oven"). If the item is not electronic waste, use "Not E-Waste".
    - "category": Classify the item into one of the following categories: 'Computers & Laptops', 'Mobile Devices', 'Home Appliances', 'Entertainment Devices', 'Batteries', 'Cables & Chargers', or 'Other E-Waste'. If not e-waste, use "Not Applicable".
    - "recyclable": A boolean value. Set to true if it is an electronic item that can be recycled, otherwise false.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        itemName: { type: Type.STRING },
        category: { type: Type.STRING },
        recyclable: { type: Type.BOOLEAN },
      },
      required: ['itemName', 'category', 'recyclable'],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error identifying e-waste with Gemini:", error);
    throw new Error("Could not identify the item. Please try a clearer image.");
  }
};

export const findRecyclingCenters = async (latitude, longitude, deviceType) => {
    if (!process.env.API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return JSON.stringify([
            { name: 'Mock GreenLeaf Recycling', address: '123 Mockingbird Lane', accepted: 'All personal electronics', bestFor: 'This is a mock center suitable for your device.' },
            { name: 'Mock All-City Metals', address: '456 Fake St', accepted: 'Wide range of electronics', bestFor: 'Good for various types of e-waste.' }
        ]);
    }

    try {
        const prompt = `You are an AI assistant for "E-Wasted", helping users find the best local e-waste recycling centers. The user is located at latitude ${latitude} and longitude ${longitude} and wants to recycle a "${deviceType}".

        Here is a list of our partner centers. Analyze this list and the user's request to recommend the top 3 most suitable options. Your recommendation should be based on proximity (though you don't have real-time distance, just pretend to consider it), the type of device they have, and any special services offered.

        Partner Centers Data:
        - GreenLeaf Recycling: Accepts all personal electronics (laptops, phones, tablets). Specializes in secure data destruction.
        - TechCycle Solutions: Focuses on large appliances (TVs, microwaves, refrigerators) and computer towers. Does not accept mobile phones.
        - All-City Metals & E-Waste: Accepts a wide range of electronics, including cables, batteries, and small appliances. Best for mixed loads.
        - Secure-IT Asset Disposal: Corporate-focused but accepts public drop-offs for computers and servers only. High-security facility.

        Now, respond ONLY with a single, valid JSON array of up to 3 objects, conforming to the provided schema. Each object represents a recommended recycling center.
        - name: The name of the center.
        - address: A fictional but plausible street address for the center.
        - accepted: A brief summary of what they accept, relevant to the user's item.
        - bestFor: A short, AI-generated reason why this is a good choice for the user (e.g., "Specializes in secure data wiping for laptops.").`;
        
        const responseSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    address: { type: Type.STRING },
                    accepted: { type: Type.STRING },
                    bestFor: { type: Type.STRING },
                },
                required: ['name', 'address', 'accepted', 'bestFor'],
            }
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error finding recycling centers with Gemini:", error);
        throw new Error("Could not find recycling centers. Please try again later.");
    }
};


export const analyzeDeviceImpact = async (deviceName, deviceCondition) => {
    if (!process.env.API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return JSON.stringify({
            impact: {
                toxicWasteAvoided: "Mock heavy metals",
                materialsRecovered: "Mock gold, copper",
                co2Saved: "Mock 50kg CO₂"
            },
            recommendation: {
                action: "Recycle",
                reason: "This is a mock analysis for your device.",
            }
        });
    }

    try {
        const prompt = `You are an environmental impact and device lifecycle expert for "E-Wasted". A user has provided details about their old electronic device. Your task is to provide a detailed analysis in a structured JSON format.

        Device Details:
        - Name: "${deviceName}"
        - Condition: "${deviceCondition}"

        Based on these details, estimate the environmental impact of recycling this device and provide a smart recommendation for its end-of-life.

        Respond ONLY with a single, valid JSON object that conforms to the provided schema.
        - impact:
          - toxicWasteAvoided: A string describing the amount and type of hazardous materials (e.g., "up to 5g of lead & mercury") prevented from entering a landfill.
          - materialsRecovered: A string listing key valuable materials that can be reclaimed (e.g., "gold, silver, & copper").
          - co2Saved: A string estimating the CO2 emissions saved compared to landfilling (e.g., "~50-100 kg of CO₂e").
        - recommendation:
          - action: Choose one: "Recycle", "Reuse", or "Refurbish".
            - Choose "Recycle" if the condition is 'Broken'.
            - Choose "Refurbish" if the condition is 'Minor Issues'.
            - Choose "Reuse" if the condition is 'Working'.
          - reason: A concise explanation for your recommendation.
          - refurbishEstimate (only include if action is "Refurbish"):
            - cost: A string estimating the potential repair cost (e.g., "$50 - $150 for screen replacement").
            - value: A string comparing the refurbishment cost to the price of a new, similar device.`;

        const refurbishEstimateSchema = {
            type: Type.OBJECT,
            properties: {
                cost: { type: Type.STRING },
                value: { type: Type.STRING },
            },
            required: ['cost', 'value']
        };

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                impact: {
                    type: Type.OBJECT,
                    properties: {
                        toxicWasteAvoided: { type: Type.STRING },
                        materialsRecovered: { type: Type.STRING },
                        co2Saved: { type: Type.STRING },
                    },
                    required: ['toxicWasteAvoided', 'materialsRecovered', 'co2Saved']
                },
                recommendation: {
                    type: Type.OBJECT,
                    properties: {
                        action: { type: Type.STRING },
                        reason: { type: Type.STRING },
                        refurbishEstimate: refurbishEstimateSchema,
                    },
                    required: ['action', 'reason']
                }
            },
            required: ['impact', 'recommendation']
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error analyzing device impact with Gemini:", error);
        throw new Error("Could not analyze the device. Please try again.");
    }
};

export const getWipingInstructions = async (deviceType) => {
    if (!process.env.API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return JSON.stringify({
            device: `Mock ${deviceType}`,
            instructions: [
                { step: 1, action: "This is a mock instruction: Back up your data first." },
                { step: 2, action: "This is a mock instruction: Sign out of all accounts." },
                { step: 3, action: "This is a mock instruction: Perform a factory reset." }
            ],
            securityTip: "For guaranteed data destruction, always use a certified service like E-Wasted.",
            disclaimer: "These are general guidelines. Steps may vary by specific model and OS version. E-Wasted is not responsible for data loss."
        });
    }

    try {
        const prompt = `You are a data security expert for "E-Wasted". A user wants to know how to securely wipe their data from a "${deviceType}". Provide clear, generic, step-by-step instructions.

        Respond ONLY with a single, valid JSON object that conforms to the provided schema.
        - device: The name of the device type you are providing instructions for.
        - instructions: An array of objects, each with a "step" (number) and "action" (string). Provide 3-5 key steps. Start with backing up data.
        - securityTip: A crucial tip about using certified services for guaranteed destruction.
        - disclaimer: A brief disclaimer that these are general instructions and E-Wasted is not liable.`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                device: { type: Type.STRING },
                instructions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            step: { type: Type.INTEGER },
                            action: { type: Type.STRING },
                        },
                        required: ['step', 'action']
                    }
                },
                securityTip: { type: Type.STRING },
                disclaimer: { type: Type.STRING },
            },
            required: ['device', 'instructions', 'securityTip', 'disclaimer']
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error getting wiping instructions from Gemini:", error);
        throw new Error("Could not generate security instructions. Please try again.");
    }
};
