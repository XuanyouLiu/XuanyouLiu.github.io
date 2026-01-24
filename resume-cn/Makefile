# Makefile for Chinese Resume
# Requires XeLaTeX for Chinese font support

TEX = xelatex
MAIN = Xuanyou_Liu_Resume_CN

.PHONY: all clean

all: $(MAIN).pdf

$(MAIN).pdf: $(MAIN).tex resume.cls
	$(TEX) $(MAIN).tex
	$(TEX) $(MAIN).tex

clean:
	rm -f *.aux *.log *.out *.synctex.gz *.fls *.fdb_latexmk

distclean: clean
	rm -f $(MAIN).pdf
