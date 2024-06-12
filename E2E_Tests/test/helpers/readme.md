## to get token setup
create a file in the root dir of this project called run.sh and add the following (updated with the correct values needed)

-----------------------

#!/usr/bin/env bash
export GMAIL_CLIENT_ID=""
export GMAIL_CLIENT_SECRET=""
export GMAIL_PROJECT_ID=""

npx ts-node E2E_Tests/test/helpers/mailClient.js


-----------------------

Be signed into the googlemail test profile ( testuserpyf@gmail.com )

then run the file 

'bash run.sh'

You will be prompted to sign into and authorise the gmail api account

Once completed the token.json file will be updated with a new renewal token ("refresh_token":). Update this in the CircleCI pipeline environment variables


