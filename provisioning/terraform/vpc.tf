resource "aws_vpc" "kt-cloud-vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}

resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.kt-cloud-vpc.id
}

resource "aws_lb" "kt-cloud-nlb" {
  name               = "kt-cloud-nlb"
  internal           = false
  load_balancer_type = "network"
  subnets = [
    aws_subnet.public-ap-northeast-2a.id,
    aws_subnet.public-ap-northeast-2b.id
  ]
}

resource "aws_route_table" "kt-cloud-public-rt" {
  vpc_id = aws_vpc.kt-cloud-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_igw.id
  }
}

resource "aws_security_group" "cluster-node-sg" {
  name   = "cluster-node-sg"
  vpc_id = aws_vpc.kt-cloud-vpc.id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.kt-cloud-vpc.cidr_block]
  }

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "udp"
    cidr_blocks = [aws_vpc.kt-cloud-vpc.cidr_block]
  }

  ingress {
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = [aws_vpc.kt-cloud-vpc.cidr_block]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion-node-sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "http" "my_ip" {
  url = "https://ifconfig.me/ip"
}

locals {
  my_ip_cidr = "${chomp(data.http.my_ip.response_body)}/32"
}

resource "aws_security_group" "bastion-node-sg" {
  name   = "bastion-node-sg"
  vpc_id = aws_vpc.kt-cloud-vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [local.my_ip_cidr]
  }

  ingress {
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = [local.my_ip_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
