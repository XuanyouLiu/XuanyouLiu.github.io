# Makefile for Resume
# Usage:
#   make        - compile resume to PDF (Xuanyou_Liu_Resume.pdf)
#   make clean  - remove auxiliary files

SRC = resume.tex
OUT = Xuanyou_Liu_Resume
TEX = pdflatex

.PHONY: all clean

all: $(OUT).pdf

$(OUT).pdf: $(SRC)
	$(TEX) -jobname=$(OUT) $(SRC)
	$(TEX) -jobname=$(OUT) $(SRC)

clean:
	rm -f *.aux *.log *.out *.fls *.fdb_latexmk *.synctex.gz $(OUT).pdf
