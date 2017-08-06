// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Add R0 R1 times.
	@2 // R2 = 0
	M=0
	@i // Set counter to 0
	M=0

(LOOP)
	@i
	D=M
	@1
	D=D-M // D = i - R1
	@END
	D;JGE

	@0
	D=M // D = R0
	@2
	M=D+M // R2 = R2 + R0
	@i
	M=M+1 // Increment counter
	@LOOP
	0;JMP
(END)
	@END
	0;JMP
