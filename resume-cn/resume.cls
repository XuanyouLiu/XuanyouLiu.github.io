\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{resume}[2025/01/24 A clean modern Chinese Résumé class]
\LoadClass[11pt]{article}

% disable indent globally
\setlength{\parindent}{0pt}
% some general improvements
\RequirePackage{xltxtra}
% use xifthen
\RequirePackage{xifthen}
% use hyperlink for email and url
\RequirePackage{hyperref}
\hypersetup{hidelinks}
\RequirePackage{url}
\urlstyle{tt}
% use xcolor for customizing color
\RequirePackage[dvipsnames]{xcolor}
% loading fonts
\RequirePackage{fontspec}

% Define colors - Northwestern Purple
\definecolor{NUPurple}{HTML}{4E2A84}
\definecolor{DarkText}{HTML}{1a1a1a}
\definecolor{GrayText}{HTML}{666666}

% CJK support
\RequirePackage{xeCJK}
% Use modern sans-serif Chinese fonts - PingFang for clean modern look
\setCJKmainfont{PingFang SC}[
    BoldFont=PingFang SC Semibold,
    ItalicFont=PingFang SC Light,
]
\setCJKsansfont{PingFang SC}[
    BoldFont=PingFang SC Semibold,
]
\setCJKmonofont{PingFang SC}

% Set English fonts - Helvetica Neue for modern clean look
\setmainfont{Helvetica Neue}[
    BoldFont=Helvetica Neue Bold,
    ItalicFont=Helvetica Neue Italic,
]
\setsansfont{Helvetica Neue}[
    BoldFont=Helvetica Neue Bold,
]

\RequirePackage[
	a4paper,
	left=0.7in,
	right=0.7in,
	top=0.55in,
	bottom=0.5in,
	nohead
]{geometry}

\RequirePackage{titlesec}
\RequirePackage{enumitem}
\setlist{noitemsep}
\setlist[itemize]{topsep=0.2em, leftmargin=1.2pc}
\setlist[enumerate]{topsep=0.2em, leftmargin=1.2pc}

\titleformat{\section}
  {\large\bfseries\raggedright\color{NUPurple}}
  {}{0em}
  {}
  [\color{NUPurple}\titlerule]
\titlespacing*{\section}{0cm}{*1.4}{*1.0}

\titleformat{\subsection}
  {\normalsize\raggedright}
  {}{0em}
  {}
\titlespacing*{\subsection}{0cm}{*1.2}{*0.4}

% Commands
\newcommand{\datedsection}[2]{%
  \section[#1]{#1 \hfill #2}%
}
\newcommand{\datedsubsection}[2]{%
  \subsection[#1]{#1 \hfill {\small\color{GrayText}#2}}%
}
\newcommand{\datedline}[2]{%
  {\par #1 \hfill {\small\color{GrayText}#2} \par}%
}

\newcommand{\name}[1]{
  \centerline{\LARGE\bfseries\color{NUPurple}{#1}}
  \vspace{0.8ex}
}

% Contact info commands - no icons, clean text only
\newcommand{\email}[1]{\href{mailto:#1}{#1}}
\newcommand{\phone}[1]{{#1}}
\newcommand{\linkedin}[2][]{%
  \ifthenelse{\isempty{#1}}%
    {\href{#2}{#2}}
    {\href{#2}{#1}}}
\newcommand{\github}[2][]{%
  \ifthenelse{\isempty{#1}}%
    {\href{#2}{#2}}
    {\href{#2}{#1}}}
\newcommand{\homepage}[2][]{%
  \ifthenelse{\isempty{#1}}%
    {\href{#2}{#2}}
    {\href{#2}{#1}}}
\newcommand{\location}[1]{{#1}}

\newcommand{\basicInfo}[1]{
  \centerline{\small\color{GrayText}{#1}}
  \vspace{1.2ex}
}

\newcommand{\role}[2]{
  {\par \textit{#1} ~ #2 \par}
  \vspace{0.5ex}
}

% For publication entries
\newcommand{\publication}[3]{
  \par\textbf{#1}\hfill\textit{#2}\\
  {\small #3}
  \vspace{0.6ex}
}

\endinput
