using Microsoft.WindowsAPICodePack.Dialogs;
using System;
// using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
// using System.Linq;
using System.Net;
// using System.Net.Http;
// using System.Net.Http.Headers;
// using System.Text;
using System.Text.RegularExpressions;
// using System.Threading.Tasks;
using System.Windows;
// using System.Windows.Controls;
// using System.Windows.Data;
// using System.Windows.Documents;
// using System.Windows.Input;
using System.Windows.Media;
// using System.Windows.Media.Imaging;
// using System.Windows.Navigation;
// using System.Windows.Shapes;
// using System.Xml.Linq;

// sorry

namespace ODK_X_Helper
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        string appDesignerPath = "";
        Process appDesigner;
        bool appDesignerRunning = false;

        public MainWindow()
        {
            InitializeComponent();
            SetActionButtonsEnabled(false);
        }

        private void ToggleAppDesigner_Click(object sender, RoutedEventArgs e)
        {
            if (!appDesignerRunning)
            {
                appDesignerRunning = true;
                appDesigner = StartCmdAction("grunt");
                ToggleAppDesigner.Content = "Stop App Designer";
                ToggleAppDesigner.Background = new SolidColorBrush(Color.FromRgb(227, 146, 146));
            }
            else
            {
                appDesignerRunning = false;
                appDesigner.Kill(entireProcessTree: true);
                appDesigner.WaitForExit();
                ToggleAppDesigner.Content = "Start App Designer";
                ToggleAppDesigner.Background = new SolidColorBrush(Color.FromRgb(173, 236, 129));
            }
        }

        private void PushConfig_Click(object sender, RoutedEventArgs e)
        {
            StartCmdAction("grunt adbpush");
            SetActionButtonsEnabled(false);
        }

        private void CleanConfig_Click(object sender, RoutedEventArgs e)
        {
            StartCmdAction("grunt clean");
            SetActionButtonsEnabled(false);
        }

        private void WriteConsoleOut(string s)
        {
            ConsoleOut.AppendText(s);
            ConsoleScroll.ScrollToVerticalOffset(ConsoleScroll.ExtentHeight);
        }

        private Process StartCmdAction(string command)
        {
            Process proc = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    WorkingDirectory = appDesignerPath,
                    FileName = "cmd.exe",
                    Arguments = "/C " + command,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                }
            };
            proc.OutputDataReceived += new DataReceivedEventHandler(OutputHandler);
            proc.ErrorDataReceived += new DataReceivedEventHandler(OutputHandler);
            proc.EnableRaisingEvents = true;
            proc.Exited += new EventHandler(CmdActionExited);
            proc.Start();
            proc.BeginOutputReadLine();
            proc.BeginErrorReadLine();
            return proc;
        }

        private void OutputHandler(object sendingProcess, DataReceivedEventArgs outLine)
        {
            Dispatcher.BeginInvoke((Action)(()=> {
                WriteConsoleOut(outLine.Data + Environment.NewLine);
            }));
        }

        private void CmdActionExited(object sender, System.EventArgs e)
        {
            SetActionButtonsEnabled(true);
        }

        private void SetActionButtonsEnabled(bool e)
        {
            Dispatcher.BeginInvoke((Action)(() => {
                ToggleAppDesigner.IsEnabled = e;
                PushConfig.IsEnabled = e;
                CleanConfig.IsEnabled = e;
                UninstallApps.IsEnabled = e;
            }));
        }

        private void PickFolder_Click(object sender, RoutedEventArgs e)
        {
            CommonOpenFileDialog cofd = new CommonOpenFileDialog
            {
                IsFolderPicker = true,
                Title = "Select ODK-X Application Designer Folder"
            };
            if (cofd.ShowDialog() == CommonFileDialogResult.Ok)
            {
                appDesignerPath = cofd.FileName;
                FolderPath.Text = appDesignerPath;
                SetActionButtonsEnabled(true);
            }
        }

        private void InstallApps_Click(object sender, RoutedEventArgs e)
        {
            string[] urls = new string[]
            {
                WebRequest("https://github.com/odk-x/services/releases/latest", "application/html"),
                WebRequest("https://github.com/odk-x/survey/releases/latest", "application/html"),
                WebRequest("https://github.com/odk-x/tables/releases/latest", "application/html"),
                WebRequest("https://github.com/openintents/filemanager/releases/latest", "application/html")
            };

            WebClient client = new WebClient();
            for (int i = 0; i < 4; i++)
            {
                string name = "odk-x";
                if (i == 3) name = "openintents";
                string url = "https://github.com" + Regex.Match(urls[i], @"/" + name + @".*\.apk").ToString();
                string filename = Path.GetFileName(url);
                string outpath = AppDomain.CurrentDomain.BaseDirectory + @"downloads\";
                // File.WriteAllText(outpath + name + i + ".html", urls[i]); // uncomment to get files for what it is scraping
                WriteConsoleOut("Downloading - " + url + " ...\n");

                if (!Directory.Exists(outpath)) Directory.CreateDirectory(outpath);
                if (!File.Exists(outpath + filename))
                {
                    client.DownloadFile(url, outpath + filename);
                }
                else
                {
                    WriteConsoleOut("File already exists in downloads folder.\n");
                }
                WriteConsoleOut("Installing to device...\n");
                Process p = StartCmdAction("adb -d install  \"" + outpath + filename + "\"");
                p.WaitForExit();
                WriteConsoleOut(outpath + filename + "\nDone!\n\n");
            }
        }

        private string WebRequest(string url, string contentType)
        {
            // https://stackoverflow.com/a/37431014
            try
            {
                var webRequest = System.Net.WebRequest.Create(url);
                if (webRequest != null)
                {
                    webRequest.Method = "GET";
                    webRequest.Timeout = 20000;
                    webRequest.ContentType = contentType;
                    using (System.IO.Stream s = webRequest.GetResponse().GetResponseStream())
                    {
                        using (System.IO.StreamReader sr = new System.IO.StreamReader(s))
                        {
                            var res = sr.ReadToEnd();
                            return res;
                        }
                    }
                }
                else
                {
                    return "WebRequest returned empty string.";
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        private void UninstallApps_Click(object sender, RoutedEventArgs e)
        {
            StartCmdAction("grunt --force uninstall");
        }
    }
}
