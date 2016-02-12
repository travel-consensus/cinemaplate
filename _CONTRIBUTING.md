# Contributing

CinemaPlate employs a **Forking Workflow**.
Details on thif flow can be found here:
https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow

## Steps To Contributing

1. Fork the repo: https://github.com/nodedoubt/cinemaplate
2. Clone your copy for local development:
   ```git clone https://github.com/<username>/cinemaplate.git```
3. Add the upstream remote: 
  ```git remote add upstream https://github.com/nodedoubt/cinemaplate.git```
4. Create a feature branch...
  a. If you are working on an undocumented feature (ie, one not in the "Issues" section of the repo), name your branch something like:  
```git checkout -b animated-menu-items```
  b. If it is a know issue/planned feature, create a branch featuring the ID of the issue as well as a name:
```git checkout -b animated-menu-items-#1061```
5. Work from your newly created branch.
6. Add and commit your changes: ```git commit -a -m "fixes #1061"``` ("fixes" and the issue # will update waffle.io")
7. Check if the project has moved forward: ```git pull --rebase upstream master```
8. Push to *your* remote: ```git push origin #1061-animated-menu-items```
9. Create a pull request.

### Forking Workflow Diagram
![Fork Flow](http://i.imgur.com/lnxEThG.png)

## Closing Tasks with Waffle.io

Closing Issues via Commits
Including a keyword and the issue # in your commit message will close that issue once it is merged into your default branch. This will automatically move the issue to the Done column on your Waffle board.

**keywords**:
close, closes, closed
fix, fixes, fixed
resolve,resolves, resolved