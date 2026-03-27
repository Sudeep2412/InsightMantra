import os
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def main():
    doc = Document()

    # Title
    title = doc.add_heading('How to Run the InsightMantra Project', level=0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    p_sub = doc.add_paragraph('A Complete Beginner\'s Setup Guide')
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_heading('Introduction', level=1)
    p_intro = doc.add_paragraph()
    p_intro.add_run('InsightMantra is a web application separated into two main parts:\n')
    p_intro.add_run('1. ').bold = True
    p_intro.add_run('The Backend (Server): Handles data scraping, machine learning, and the database. Written in Python.\n')
    p_intro.add_run('2. ').bold = True
    p_intro.add_run('The Frontend (User Interface): The graphical website you click and interact with. Written in React & Node.js.\n\n')
    p_intro.add_run('To run this project, we need to start both the Backend and the Frontend at the same time. This guide will walk you through doing exactly that from scratch.')

    doc.add_heading('Step 1: Install Required Software', level=1)
    p_s1 = doc.add_paragraph()
    p_s1.add_run('Before we start, you need to install a few foundational programs if you don\'t have them already.\n\n')
    p_s1.add_run('1. Python (For the Backend)\n').bold = True
    p_s1.add_run('   • Go to python.org/downloads and download the latest version for Windows.\n')
    p_s1.add_run('   • ⚠️ IMPORTANT: When you run the Python installer, look at the very bottom of the first setup screen and CHECK the box that says "Add Python to PATH" or "Add python.exe to PATH". If you miss this, the commands won\'t work!\n')
    p_s1.add_run('   • Complete the installation.\n\n')
    p_s1.add_run('2. Node.js (For the Frontend)\n').bold = True
    p_s1.add_run('   • Go to nodejs.org and download the "LTS" (Long Term Support) version for Windows.\n')
    p_s1.add_run('   • Run the installer and just click "Next" on everything until it\'s finished.\n\n')
    p_s1.add_run('3. Google Chrome\n').bold = True
    p_s1.add_run('   • Make sure Google Chrome is installed on your computer, as the project uses it in the background to collect data.\n\n')
    p_s1.add_run('4. Check your installations\n').bold = True
    p_s1.add_run('   • Hit the Windows Key, type "cmd", and press Enter to open the Command Prompt.\n')
    p_s1.add_run('   • Type "python --version" and press Enter. It should print a version number (like Python 3.10.x).\n')
    p_s1.add_run('   • Type "node --version" and press Enter. It should print a version number (like v18.x.x).\n')
    p_s1.add_run('   If both work, you\'re ready for the next step!')

    doc.add_heading('Step 2: Prepare the Backend (The Server)', level=1)
    p_s2 = doc.add_paragraph()
    p_s2.add_run('The Backend runs on Python and needs its own "virtual environment" so its packages don\'t mess up your computer.\n\n')
    p_s2.add_run('1. Open up a Command Prompt.\n')
    p_s2.add_run('2. Navigate to the project folder. For example, if your folder is on your Desktop, type:\n')
    p_s2.add_run('   cd Desktop\\work\\InsightMantra\n').italic = True
    p_s2.add_run('   (Press Enter)\n')
    p_s2.add_run('3. Create the virtual environment by typing:\n')
    p_s2.add_run('   python -m venv venv\n').italic = True
    p_s2.add_run('   (Press Enter. Wait a few seconds for it to finish).\n')
    p_s2.add_run('4. Activate the virtual environment by typing:\n')
    p_s2.add_run('   venv\\Scripts\\activate\n').italic = True
    p_s2.add_run('   (Press Enter. You should now see "(venv)" at the start of the command line).\n')
    p_s2.add_run('5. Install all required Python packages for the project:\n')
    p_s2.add_run('   pip install -r backend\\requirements.txt\n').italic = True
    p_s2.add_run('   (Press Enter. This step might take a few minutes as it downloads machine learning and web tools).\n')
    p_s2.add_run('6. Note setting up the database:\n')
    p_s2.add_run('   If there is no database yet, type "python" and press Enter. Then type:\n')
    p_s2.add_run('   from backend import app, db\n   with app.app_context():\n       db.create_all()\n   exit()\n').italic = True
    p_s2.add_run('   (Press Enter after each).\n')
    p_s2.add_run('7. Finally, start the backend server:\n')
    p_s2.add_run('   python app.py\n').italic = True
    p_s2.add_run('   (Press Enter).\n')
    p_s2.add_run('   You should see text saying it\'s running on "http://127.0.0.1:5000". Leave this Command Prompt window OPEN and running. Do not close it!')

    doc.add_heading('Step 3: Prepare the Frontend (The Website UI)', level=1)
    p_s3 = doc.add_paragraph()
    p_s3.add_run('Now we need to start the visual part of the project.\n\n')
    p_s3.add_run('1. Leave the first Command Prompt alone, and open a NEW, second Command Prompt window.\n')
    p_s3.add_run('2. Navigate to the project\'s frontend folder:\n')
    p_s3.add_run('   cd Desktop\\work\\InsightMantra\\frontend\n').italic = True
    p_s3.add_run('   (Press Enter)\n')
    p_s3.add_run('3. Install the web packages by typing:\n')
    p_s3.add_run('   npm install\n').italic = True
    p_s3.add_run('   (Press Enter. Wait a minute for this to finish).\n')
    p_s3.add_run('4. Start the frontend website:\n')
    p_s3.add_run('   npm run dev\n').italic = True
    p_s3.add_run('   (Press Enter).\n')
    p_s3.add_run('   Once it is ready, it will show a local web address, usually "http://localhost:5173".')

    doc.add_heading('Step 4: View Your Project in the Web Browser!', level=1)
    p_s4 = doc.add_paragraph()
    p_s4.add_run('1. Open Google Chrome (or your favorite browser).\n')
    p_s4.add_run('2. In the top address bar, type the URL from the frontend step:\n')
    p_s4.add_run('   http://localhost:5173\n').italic = True
    p_s4.add_run('3. Press Enter. You should now see the InsightMantra website load successfully!\n')

    doc.add_heading('Troubleshooting (If things go wrong)', level=1)
    p_s5 = doc.add_paragraph()
    p_s5.add_run('• Error: "python is not recognized as an internal or external command"\n').bold = True
    p_s5.add_run('  -> You forgot to click "Add Python to PATH" during installation. Re-run the Python installer and choose "Modify" to add it.\n\n')
    p_s5.add_run('• Model Download Errors\n').bold = True
    p_s5.add_run('  -> The first time you use the Sentiment Analysis feature, your Backend terminal will download large machine learning files for a few minutes. If it seems frozen, just give it time.\n\n')
    p_s5.add_run('• Error: ModuleNotFoundError\n').bold = True
    p_s5.add_run('  -> Ensure you activated your virtual environment (you see "venv" in your terminal) before running "python app.py".\n\n')

    p_end = doc.add_paragraph()
    p_end.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_end.add_run('Enjoy using InsightMantra!').bold = True

    doc.save(r'C:\Users\sudee\Desktop\work\InsightMantra\InsightMantra_Setup_Guide.docx')

if __name__ == '__main__':
    main()
