import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', 'Splash.page.css'],
  standalone: false,
})
export class HomePage implements OnInit {
  showSplash = true;
  showDashboard = false;
  showHelp = false;
  showSettings = false;
  problemLocation = '';
  problemDetails = '';
  reportStatus = '';
  isSharingReport = false;

  voiceInstructions = true;
  autoRecalculateRoute = true;
  locationAccess = true;
  notifications = true;
  darkMode = false;
  language = 'English';

  ngOnInit(): void {
    this.applyTheme();
  }

  applyTheme(): void {
    document.body.classList.toggle('dark-theme', this.darkMode);
  }

  openDashboard(): void {
    this.showSplash = false;
    this.showDashboard = true;
    this.showHelp = false;
    this.showSettings = false;
  }

  openHelp(): void {
    this.showSplash = false;
    this.showHelp = true;
    this.showSettings = false;
  }

  closeHelp(): void {
    this.showHelp = false;
  }

  openSettings(): void {
    this.showSplash = false;
    this.showDashboard = true;
    this.showHelp = false;
    this.showSettings = true;
  }

  closeSettings(): void {
    this.showSplash = false;
    this.showSettings = false;
  }

  async submitProblemReport(): Promise<void> {
    const details = this.problemDetails.trim();
    if (!details) {
      this.reportStatus = 'Describe the problem before sharing the report.';
      return;
    }

    const location = this.problemLocation.trim() || 'Not provided';
    const report = `RoomFinder problem report\nLocation: ${location}\n\nProblem:\n${details}`;
    this.isSharingReport = true;
    this.reportStatus = '';

    try {
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({ title: 'RoomFinder problem report', text: report });
          this.reportStatus = 'Report shared successfully.';
          return;
        } catch (shareError: unknown) {
          if (shareError instanceof DOMException && shareError.name === 'AbortError') {
            this.reportStatus = 'Sharing was canceled. The report was not sent.';
            return;
          }
        }
      }

      await navigator.clipboard.writeText(report);
      this.reportStatus = 'Report copied. Paste it into a message to your campus support team.';
    } catch (error: unknown) {
      const reason = error instanceof Error ? ` ${error.message}` : '';
      this.reportStatus = `Could not share or copy the report.${reason} Check browser permissions and try again.`;
    } finally {
      this.isSharingReport = false;
    }
  }
}