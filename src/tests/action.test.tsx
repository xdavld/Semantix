import { sendActionData, ActionParams, ActionResponse } from "../utils/action";

// Mock für fetch-API
global.fetch = jest.fn();

describe("sendActionData", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Setzt Mocks vor jedem Test zurück
    });

    it("should send the correct request payload and handle a successful response", async () => {
        const mockResponse: ActionResponse = {
            data: [{
                id: 1,
                player_id: "123",
                playerInput: "test",
                player_score: 100,
                target_word_id: "word123",
                isHint: false,
                isSurrender: false,
                isWin: true,
                difficulty: "easy"
            }]
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const params: ActionParams = {
            playerId: "123",
            playerInput: "test",
            playerScore: 100,
            targetWordId: "word123",
            isHint: false,
            isSurrender: false,
            isWin: true,
            difficulty: "easy",
        };

        const result = await sendActionData(params);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith("/api/data/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        expect(result).toEqual(mockResponse);
    });

    it("should throw an error if the response is not OK", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Server error" }),
        });

        const params: ActionParams = { playerId: "123" };

        await expect(sendActionData(params)).rejects.toThrow("Server error");
    });

    it("should throw a generic error if no error message is provided", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({}),
        });

        const params: ActionParams = { playerId: "123" };

        await expect(sendActionData(params)).rejects.toThrow("Failed to send data");
    });
});
