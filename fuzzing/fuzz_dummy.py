import atheris
import sys

def TestOneInput(data: bytes) -> None:
    _ = data[:1024]

def main():
    atheris.Setup(sys.argv, TestOneInput)
    atheris.Fuzz()

if __name__ == "__main__":
    main()
