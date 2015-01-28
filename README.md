# instantbird-usability-gitio
Git.io: GitHub URL Shortener

Do you have a GitHub URL you'd like to shorten? Use Git.io!

Usage:

/gitio https://github.com/alexsalas/instantbird-usability-gitio

And the vanity URL is sent to the conversation.

GitHub Blog

https://github.com/blog/985-git-io-github-url-shortener

The Code

Git.io was written and deployed by myself and @atmos as a big experiment. Our goals:

    Use Riak.
    Deploy on Rackspace Cloud.

You can assemble your own with Guillotine, the URL shortening hobby kit. It's written in Ruby as a Sinatra app, and supports storing links in Riak or a relational DB.

Though a URL shortener is about the easiest project one could take on, it gave us a chance to experiment. As a result, I've been able to spread my excitement about Riak to more people at GitHub. The Riak 1.0 upgrade gave us a chance to experiment with a rolling upgrade across our cluster (for the new version, and the new leveldb backend). We also have better support with our Hubot and puppet scripts for managing deployments through Rackspace Cloud.