# Git Notary

A quick and dirty hack to use Notary for git tags.

## Git Signed Objects

Git provides a great mechanism to sign commits, tags, etc. However, it does not solve the problem of key exchange so chances are that checking a tag's signature ends up with:

```
$ git verify-tag signed-tag
gpg: Signature made Mon Sep 21 06:25:08 2015 UTC using RSA key ID 42424242
gpg: Can't check signature: public key not found
$
```

Of course we can import the key from a key server but then we'll have answer the question: *can we trust the retrieved key?*

## Notarized Tag

The idea is to use the notary infrastructure and apply it to git tags in replacement or in addition of the current existing mechanism. In a nutshell the procedure to use notary on git tag will be:

1. Create your tag using git, *add* it to notary using the *GUN* defined for the project and the tag name as *target*
2. When pushing your tag, *publish* it

On the receiver side it'll be:

1. Fetch your tag
2. *Verify* your tag using the project's *GUN* and the tag as *target*

And *voilà*

The *best* implementation for this would have been to hack git directly and add a new option to `git-tag` to handle notarized tags. In 5 days, with a full time job and *journées du patrimoine* in the middle? Don't even think about it! But everything isn't lost since we have...

## El Cheapo Docker Hack

Instead of a full fledged implementation this is more a working proof of concept demonstrating how simple it'll be to use notary on git tags. This is done in bash using the `git` and `notary` commands.

### Prerequisites

In order to enjoy Git Notary you need obviously to have a working version of `git` and `notary`. Regarding this last one, at the time of this writing, there is an issue with the `notary verify` command which does not support the `--server` option to specify the trust server URL. Before using Git Notary ensure that you can use `notary verify` on you setup and if you need to change the default server URL have a look at this [Nice PR](https://github.com/docker/notary/pull/196) which fixes this issue and introduce an environment variable to specify the trust server URL.

### Usage

#### Init Git Notary

The first thing to do to use Git Notary in a git working directory is to prepare the directory. This is done with `git notary init <GUN>`.

#### Create a Notarized Tag

Work as usual but instead of using `git tag <tag_name>` to create your tag, use `git notary tag <tag_name>`. It'll create the tag and call `notary add`. At this point both the git tag and the notary certification only exist locally.

#### Publish Your Tag

Next step is to push/publish the notarized tag. This is done with `git notary push <tag_name>`. It will ask you for a notary password, publish the notary certification and then push the tag.

#### Tag Verification

The tag verification relies on the `git notary verify <tag_name>` command. In order to use it you have first to pull the tag from the remote repository. The command with display a human readable status of the verification and will set the exit code to non-zero if the verification cannot be done.

### Small Demo

In the demo below, the upper part window is the tag creator while the lower part is a tag verifier. In a first time, it displays how the tag is created, published and then verified. In a second time, the tag is changes without being re-notarized and the verification then fails.

![Small Demo](git-notary-demo.gif)

## Issues & Improvements

The biggest improvement should be to rewrite with another language such as Python, C or Go.

Also, it'll be nice to transparently integrate with the pull/push mechanism by setting up git hooks during the init phase. This will enable to publish the notary certification when a notarized tag is pushed and to check notarized tags when they are pulled from the repository. The issue here is that `notary publish` need user input to get a password and that git already uses `stdin` to send the references being pushed. 
