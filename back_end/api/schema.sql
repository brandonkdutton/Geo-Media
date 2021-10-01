SET FOREIGN_KEY_CHECKS=0;
drop table if exists Locations;
drop table if exists UserPosts;
drop table if exists Users;
drop table if exists UserReplies;
drop table if exists PostCategories;
drop table if exists Categories;
SET FOREIGN_KEY_CHECKS=1;

create table Locations (
  locId int auto_increment,
  lat decimal(25,20) not null,
  lng decimal(25,20) not null,
  primary key(locId)
);

create table Users (
    userId int auto_increment,
    cognitoSub varchar(64) unique not null,
    userName varchar(64) unique not null,
    email varchar(64) unique not null,
    emailVerified boolean default false,
    primary key(userId)
);
create index cognitoSubIndex on Users (cognitoSub);

create table Categories (
  categoryId int auto_increment,
  categoryName varchar(50) unique not null,
  primary key(categoryId)
);
create index categoryNameIndex on Categories (categoryName);

create table UserPosts (
  postId int auto_increment,
  locId int not null,
  userId int,
  postTitle varchar(200) not null,
  postContent text not null,
  createdAt timestamp default current_timestamp,
  primary key(postId),
  foreign key (userId) references Users(userId) on delete set null,
  foreign key (locId) references Locations(locId) on delete cascade
);

create table UserReplies (
  replyId int auto_increment,
  userId int,
  postId int not null,
  replyContent text not null,
  createdAt timestamp default current_timestamp,
  primary key(replyId),
  foreign key (userId) references Users(userId) on delete set null,
  foreign key (postId) references UserPosts(postId) on delete cascade
);

create table PostCategories (
  postId int,
  categoryId int,
  primary key(postId,categoryId),
  foreign key (postId) references UserPosts(postId),
  foreign key (categoryId) references Categories(categoryId)
);