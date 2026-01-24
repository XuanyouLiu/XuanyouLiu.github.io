# Makefile for English Resume
# Uses pdflatex

TEX = pdflatex
MAIN = Xuanyou_Liu_Resume

.PHONY: all clean

all: $(MAIN).pdf

$(MAIN).pdf: $(MAIN).tex
	$(TEX) $(MAIN).tex
	$(TEX) $(MAIN).tex

clean:
	rm -f *.aux *.log *.out *.synctex.gz *.fls *.fdb_latexmk

distclean: clean
	rm -f $(MAIN).pdf
