import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material"; 

type Card = {
    id: number;
    content: string;
    isFlipped: boolean;
    isMatched: boolean;
};

const generateCards = (): Card[] => {
    const symbols = [
        "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
        "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐧",
        "🐢", "🐙",
    ];

    const cards = symbols
        .concat(symbols)
        .map((content, index) => ({
            id: index,
            content,
            isFlipped: false,
            isMatched: false,
        }))
        .sort(() => Math.random() - 0.5);
    return cards;
};

const App: React.FC = () => {
    const [cards, setCards] = useState<Card[]>(generateCards());
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState<number>(0);
    const [timer, setTimer] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (!gameOver) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameOver]);

    const handleCardClick = (index: number) => {
        if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
            return;
        }

        const newFlippedCards = [...flippedCards, index];
        const newCards = cards.map((card, i) =>
            i === index ? { ...card, isFlipped: true } : card
        );

        setCards(newCards);
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            setMoves((prev) => prev + 1);
            setTimeout(() => checkForMatch(newFlippedCards), 1000);
        }
    };

    const checkForMatch = (flipped: number[]) => {
        const [firstIndex, secondIndex] = flipped;
        let newCards = [...cards];

        if (newCards[firstIndex].content === newCards[secondIndex].content) {
            newCards[firstIndex].isMatched = true;
            newCards[secondIndex].isMatched = true;
        } else {
            newCards[firstIndex].isFlipped = false;
            newCards[secondIndex].isFlipped = false;
        }

        setCards(newCards);
        setFlippedCards([]);

        if (newCards.every((card) => card.isMatched)) {
            setGameOver(true);
        }
    };

    const restartGame = () => {
        setCards(generateCards());
        setFlippedCards([]);
        setMoves(0);
        setTimer(0);
        setGameOver(false);
    };

    return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h5" gutterBottom>Memory Game</Typography>
            <Box>
                <Typography variant="h6">Time: {timer} seconds</Typography>
                <Typography variant="h6">Moves: {moves}</Typography>
                {gameOver && (
                    <Typography variant="h5" color="primary">
                        Game Over! You finished in {timer} seconds with {moves} moves.
                    </Typography>
                )}
                <Button variant="contained" sx={{ mt: 2 }} onClick={restartGame}>
                    Restart Game
                </Button>
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)", // 6 Spalten für das 6x6-Gitter
                    gridTemplateRows: "repeat(6, 1fr)", // 6 Zeilen für das 6x6-Gitter
                    gap: "10px",
                    width: "70vmin", // Höhe und Breite des Feldes wird gleich gehalten
                    height: "70vmin", // Deswegen bleibt Feld quadratisch
                    margin: "0 auto", // Zentriert Feld
                    mt: 4,
                }}
            >
                {cards.map((card, index) => (
                    <Box
                        key={card.id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                            border: "2px solid",
                            borderColor: card.isFlipped || card.isMatched ? "#1976d2" : "#ccc",
                            backgroundColor: card.isFlipped || card.isMatched ? "#fff" : "#ccc",
                            cursor: "pointer",
                            borderRadius: "8px",
                            transition: "background-color 0.3s ease",
                            userSelect: "none",
                            aspectRatio: "1 / 1",
                        }}
                        onClick={() => handleCardClick(index)}
                    >
                        {card.isFlipped || card.isMatched ? card.content : ""}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default App;
